import { haversineDistanceKm } from "./travelEstimate";

export type NearbyCategory = "locker" | "store" | "cafe" | "restroom";

export type NearbyPlace = {
  id: string;
  name: string;
  category: NearbyCategory;
  lat: number;
  lon: number;
  distanceMeters: number;
  walkMinutes: number;
};

// The free Overpass instances are occasionally flaky under load — some
// requests get rejected outright (406/504), others just hang with no
// response at all. Try several, independently hosted, mirrors in turn.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const PER_ATTEMPT_TIMEOUT_MS = 6000;
const WALKING_METERS_PER_MINUTE = 67; // ~4km/h

// A hanging mirror (no response, no error) would otherwise block the retry
// loop indefinitely on the browser's own — much longer — fetch timeout, so
// each attempt gets its own bounded deadline in addition to the caller's
// abort signal (used when the surrounding React effect is cleaned up).
async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  outerSignal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const onOuterAbort = () => controller.abort();
  outerSignal?.addEventListener("abort", onOuterAbort);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
    outerSignal?.removeEventListener("abort", onOuterAbort);
  }
}

const CATEGORY_LABEL: Record<NearbyCategory, string> = {
  locker: "코인락커",
  store: "편의점",
  cafe: "카페",
  restroom: "화장실",
};

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function categorizeElement(tags: Record<string, string> | undefined): NearbyCategory | null {
  if (!tags) return null;
  if (tags.shop === "convenience") return "store";
  if (tags.amenity === "cafe") return "cafe";
  if (tags.amenity === "toilets") return "restroom";
  if (tags.amenity === "lockers" || tags.amenity === "luggage_locker") return "locker";
  return null;
}

// OpenStreetMap Overpass API — public, no key required. Queries nodes
// tagged as the four facility categories the venue-map screen shows.
export async function fetchNearbyPlaces(
  coords: { lat: number; lon: number },
  radiusMeters = 800,
  signal?: AbortSignal,
): Promise<NearbyPlace[]> {
  const query = `
    [out:json][timeout:15];
    (
      node["shop"="convenience"](around:${radiusMeters},${coords.lat},${coords.lon});
      node["amenity"="cafe"](around:${radiusMeters},${coords.lat},${coords.lon});
      node["amenity"="toilets"](around:${radiusMeters},${coords.lat},${coords.lon});
      node["amenity"="lockers"](around:${radiusMeters},${coords.lat},${coords.lon});
    );
    out center;
  `;

  // POST gets rejected (406) by overpass-api.de's front-end server — the
  // identical query works fine as a GET, so use that instead.
  const params = new URLSearchParams({ data: query });
  let response: Response | null = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const attempt = await fetchWithTimeout(
        `${endpoint}?${params}`,
        PER_ATTEMPT_TIMEOUT_MS,
        signal,
      );
      if (attempt.ok) {
        response = attempt;
        break;
      }
    } catch (error) {
      if (signal?.aborted) throw error; // caller cancelled — stop retrying
      // otherwise this mirror timed out or errored — try the next one
    }
  }
  if (!response) throw new Error("주변 시설을 불러오지 못했어요.");

  const data = (await response.json()) as { elements?: OverpassElement[] };
  const elements = data.elements ?? [];

  return elements
    .map((element): NearbyPlace | null => {
      const category = categorizeElement(element.tags);
      if (!category) return null;
      const lat = element.lat ?? element.center?.lat;
      const lon = element.lon ?? element.center?.lon;
      if (lat == null || lon == null) return null;

      const distanceMeters = Math.round(
        haversineDistanceKm(coords, { lat, lon }) * 1000,
      );
      return {
        id: String(element.id),
        name: element.tags?.name || CATEGORY_LABEL[category],
        category,
        lat,
        lon,
        distanceMeters,
        walkMinutes: Math.max(1, Math.round(distanceMeters / WALKING_METERS_PER_MINUTE)),
      };
    })
    .filter((place): place is NearbyPlace => place !== null)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}
