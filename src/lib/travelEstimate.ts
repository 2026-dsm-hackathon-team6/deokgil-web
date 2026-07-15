// Rough client-side estimate — no routing API, just straight-line distance
// at an assumed average urban transit speed (walking + transfers included).
const ASSUMED_SPEED_KMH = 25;
const ENTRY_BUFFER_MINUTES = 20;

export function haversineDistanceKm(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lon - from.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimateTravelMinutes(distanceKm: number): number {
  return Math.round((distanceKm / ASSUMED_SPEED_KMH) * 60);
}

export function estimateDepartureTime(eventStart: Date, travelMinutes: number): Date {
  return new Date(eventStart.getTime() - (travelMinutes + ENTRY_BUFFER_MINUTES) * 60000);
}

// WMO weather codes used by Open-Meteo, collapsed to a short Korean label.
export function weatherCodeToLabel(code: number): string {
  if (code === 0) return "맑음";
  if (code <= 3) return "구름 조금";
  if (code === 45 || code === 48) return "안개";
  if (code >= 51 && code <= 57) return "이슬비";
  if (code >= 61 && code <= 67) return "비";
  if (code >= 71 && code <= 77) return "눈";
  if (code >= 80 && code <= 82) return "소나기";
  if (code >= 95) return "뇌우";
  return "-";
}

export type WeatherEstimate = { tempC: number; label: string };

// Open-Meteo requires no API key; hourly forecast is used so we can pick the
// slot nearest the event's start time instead of only "right now".
export async function fetchWeatherEstimate(
  coords: { lat: number; lon: number },
  atTime: Date,
  signal?: AbortSignal,
): Promise<WeatherEstimate | null> {
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    hourly: "temperature_2m,weathercode",
    timezone: "auto",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!response.ok) return null;
  const data = (await response.json()) as {
    hourly?: { time: string[]; temperature_2m: number[]; weathercode: number[] };
  };
  const hourly = data.hourly;
  if (!hourly || hourly.time.length === 0) return null;

  const target = atTime.getTime();
  let closestIndex = 0;
  let closestDiff = Infinity;
  hourly.time.forEach((time, index) => {
    const diff = Math.abs(new Date(time).getTime() - target);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = index;
    }
  });

  return {
    tempC: Math.round(hourly.temperature_2m[closestIndex]),
    label: weatherCodeToLabel(hourly.weathercode[closestIndex]),
  };
}
