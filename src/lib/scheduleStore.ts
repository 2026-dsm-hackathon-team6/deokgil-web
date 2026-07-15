export type ScheduleItem = {
  time: string;
  label: string;
  description: string;
  type: "start" | "arrival" | "activity" | "main" | "end";
};

export type ChecklistItem = {
  id: string;
  label: string;
  reason?: string;
  checked: boolean;
};

export type ConfirmedSchedule = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventEndAt: string;
  venue: string;
  items: ScheduleItem[];
  checklist: ChecklistItem[];
  confirmedAt: string;
};

// Keyed per event so multiple events can each carry their own generated
// schedule instead of a single app-wide one.
const KEY_PREFIX = "deokgil-confirmed-schedule-v2";

const getStorageKey = (eventId: string) => `${KEY_PREFIX}:${eventId}`;

export function loadConfirmedSchedule(eventId: string): ConfirmedSchedule | null {
  try {
    const stored = window.localStorage.getItem(getStorageKey(eventId));
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<ConfirmedSchedule>;
    if (!Array.isArray(parsed.items)) return null;
    return {
      eventId,
      eventTitle: parsed.eventTitle || "",
      eventDate: parsed.eventDate || "",
      eventEndAt: parsed.eventEndAt || "",
      venue: parsed.venue || "",
      items: parsed.items,
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
      confirmedAt: parsed.confirmedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveConfirmedSchedule(schedule: ConfirmedSchedule) {
  window.localStorage.setItem(getStorageKey(schedule.eventId), JSON.stringify(schedule));
}

export function clearConfirmedSchedule(eventId: string) {
  window.localStorage.removeItem(getStorageKey(eventId));
}

export function hasConfirmedSchedule(eventId: string): boolean {
  return loadConfirmedSchedule(eventId) !== null;
}
