import { ApiError } from "./auth";
import type { EventDetail, EventSummary } from "./deokgilApi";

// apiRequest throws ApiError(status=0) for both "couldn't reach the server"
// and "server never responded before our own timeout" — both mean the
// backend is unusable right now, as opposed to a real 4xx/5xx from it.
export function isBackendUnreachable(error: unknown): boolean {
  return error instanceof ApiError && error.status === 0;
}

const DEMO_EVENTS_KEY = "deokgil-demo-events-v1";

export function loadDemoEvents(): EventDetail[] {
  try {
    const stored = window.localStorage.getItem(DEMO_EVENTS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDemoEvents(events: EventDetail[]) {
  window.localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(events));
}

export function toEventSummary(event: EventDetail): EventSummary {
  return {
    eventId: event.eventId,
    title: event.title,
    startAt: event.startAt,
    endAt: event.endAt,
    placeName: event.placeName,
  };
}

export const DEMO_ACCESS_TOKEN_PREFIX = "demo-";

export const demoUser = {
  id: "demo-user",
  nickname: "덕길이 게스트",
  profileImage: "",
  email: "demo@deokgil.app",
};
