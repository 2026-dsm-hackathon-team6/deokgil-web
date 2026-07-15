import { apiRequest } from "./auth";
import {
  isBackendUnreachable,
  loadDemoEvents,
  saveDemoEvents,
  toEventSummary,
} from "./demoFallback";

export type EventSummary = { eventId: string; title: string; startAt: string; endAt: string; placeName?: string };
export type Schedule = { scheduleId: string; type: "MOVE" | "WAITING" | "GOODS" | "VISIT" | "PERFORMANCE" | "RETURN" | "ETC"; title: string; startAt: string; endAt: string };
export type ScheduleUpdate = { scheduleId: string; title?: string; startAt?: string; endAt?: string };
export type EventDetail = EventSummary & { address?: string; latitude?: number; longitude?: number; eventUrl?: string; createdType?: "MANUAL" | "AI"; schedules?: Schedule[] };
export type ExtractedEvent = { title?: string; startAt?: string; endAt?: string; placeName?: string; address?: string; eventUrl?: string };
export type ChecklistItem = { checklistId: string; content: string; checked: boolean };
export type Briefing = { departureTime?: string; weather?: string; preparation?: string[]; transportInfo?: string };
export type EventMap = { placeName?: string; address?: string; latitude?: number; longitude?: number; facilities?: { type?: string; name?: string; distance?: number }[] };
export type Notification = { notificationId: string; eventId?: string; eventTitle?: string; type?: "DAY_BEFORE" | "DEPARTURE" | "PERFORMANCE_START" | "RETURN"; title?: string; content?: string; notifyAt?: string; sent?: boolean };

export const extractEvent = (eventUrl: string) => apiRequest<ExtractedEvent>("/api/v1/events/extract", { method: "POST", body: { eventUrl }, withAuth: true });

// Backend-down fallback: these keep the demo click-through alive on
// ApiError(status=0) (unreachable/timed-out backend, see isBackendUnreachable)
// by reading/writing a local event list instead. Any real error (4xx/5xx)
// still throws normally.
export const createEvent = async (body: { title: string; startAt: string; endAt: string; placeName?: string; address?: string; eventUrl?: string }) => {
  try {
    return await apiRequest<EventSummary & { message?: string }>("/api/v1/events", { method: "POST", body, withAuth: true });
  } catch (error) {
    if (!isBackendUnreachable(error)) throw error;
    const demoEvent: EventDetail = { eventId: crypto.randomUUID(), ...body, createdType: "MANUAL" };
    saveDemoEvents([...loadDemoEvents(), demoEvent]);
    return demoEvent;
  }
};
export const getUpcomingEvents = async () => {
  try {
    return await apiRequest<{ events?: EventSummary[] }>("/api/v1/events/list?page=0&size=50", { method: "GET", withAuth: true });
  } catch (error) {
    if (!isBackendUnreachable(error)) throw error;
    return { events: loadDemoEvents().map(toEventSummary) };
  }
};
export const getEventHistory = () => apiRequest<{ events?: { title?: string; date?: string; placeName?: string }[] }>("/api/v1/events/history", { method: "GET", withAuth: true });
export const getEvent = async (eventId: string) => {
  try {
    return await apiRequest<EventDetail>(`/api/v1/events/${eventId}`, { method: "GET", withAuth: true });
  } catch (error) {
    if (!isBackendUnreachable(error)) throw error;
    const found = loadDemoEvents().find((event) => event.eventId === eventId);
    if (!found) throw error;
    return found;
  }
};
export const deleteEvent = async (eventId: string) => {
  try {
    return await apiRequest<{ message: string }>(`/api/v1/events/${eventId}`, { method: "DELETE", withAuth: true });
  } catch (error) {
    if (!isBackendUnreachable(error)) throw error;
    saveDemoEvents(loadDemoEvents().filter((event) => event.eventId !== eventId));
    return { message: "삭제되었습니다." };
  }
};
export const getBriefing = (eventId: string) => apiRequest<Briefing>(`/api/v1/events/${eventId}/briefing`, { method: "GET", withAuth: true });
export const getEventMap = (eventId: string) => apiRequest<EventMap>(`/api/v1/events/${eventId}/map`, { method: "GET", withAuth: true });
export const generateChecklist = (eventId: string) => apiRequest<{ eventId?: string; weather?: string; items?: ChecklistItem[] }>(`/api/v1/events/${eventId}/checklist`, { method: "POST", withAuth: true });
export const generateSchedules = (eventId: string, body: { purpose: string; priorities?: Schedule["type"][]; transportation: "PUBLIC_TRANSPORT" | "CAR" | "WALK" }) => apiRequest<{ eventId?: string; schedules?: Schedule[] }>(`/api/v1/events/${eventId}/schedules/generate`, { method: "POST", body, withAuth: true });
export const updateSchedules = (schedules: ScheduleUpdate[]) => apiRequest<{ message?: string; schedules?: Schedule[] }>("/api/v1/schedules", { method: "PATCH", body: { schedules }, withAuth: true });
export const deleteSchedule = (scheduleId: string) => apiRequest<{ message: string }>(`/api/v1/schedules/${scheduleId}`, { method: "DELETE", withAuth: true });
export const getNotifications = () => apiRequest<{ notifications?: Notification[] }>("/api/v1/notifications", { method: "GET", withAuth: true });
export const updateFcmToken = (fcmToken: string) => apiRequest<{ message: string }>("/api/v1/users/me/fcm-token", { method: "PATCH", body: { fcmToken }, withAuth: true });
export const obfuscateLocation = (latitude: number, longitude: number) => apiRequest<{ latitude?: number; longitude?: number }>("/api/locations/obfuscate", { method: "POST", body: { latitude, longitude }, withAuth: true });
export const recommendRoute = (body: { eventId: string; locations?: { type?: string; placeName?: string }[]; transportation: "PUBLIC_TRANSPORT" | "CAR" | "WALK" }) => apiRequest<{ eventId?: string; route?: { order?: number; placeName?: string; arrivalTime?: string; duration?: number }[]; totalDistance?: number; totalTime?: number }>("/api/v1/routes/recommend", { method: "POST", body, withAuth: true });
