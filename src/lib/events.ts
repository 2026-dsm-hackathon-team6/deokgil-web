const DELETED_EVENT_IDS_KEY = "deokgil-deleted-event-ids";

export function loadDeletedEventIds(): string[] {
  try {
    const value = window.localStorage.getItem(DELETED_EVENT_IDS_KEY);
    return value ? (JSON.parse(value) as string[]) : [];
  } catch {
    return [];
  }
}

export function markEventAsDeleted(eventId: string) {
  const deletedEventIds = new Set(loadDeletedEventIds());
  deletedEventIds.add(eventId);
  window.localStorage.setItem(
    DELETED_EVENT_IDS_KEY,
    JSON.stringify([...deletedEventIds]),
  );
}
