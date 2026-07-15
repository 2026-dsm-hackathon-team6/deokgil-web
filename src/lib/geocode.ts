const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const TIMEOUT_MS = 6000;

async function searchOnce(
  text: string,
  outerSignal?: AbortSignal,
): Promise<{ lat: number; lon: number } | null> {
  const params = new URLSearchParams({ q: text, format: "json", limit: "1" });
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onOuterAbort = () => controller.abort();
  outerSignal?.addEventListener("abort", onOuterAbort);

  let response: Response;
  try {
    response = await fetch(`${NOMINATIM_ENDPOINT}?${params}`, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
    outerSignal?.removeEventListener("abort", onOuterAbort);
  }
  if (!response.ok) throw new Error("위치를 찾지 못했어요.");

  const results = (await response.json()) as { lat: string; lon: string }[];
  const first = results[0];
  if (!first) return null;

  return { lat: Number(first.lat), lon: Number(first.lon) };
}

// OpenStreetMap Nominatim — public, no key required. Used to turn a typed
// place name/address into coordinates so the nearby-facility search can
// re-center on it (Overpass only takes lat/lon, not free text).
export async function geocodeAddress(
  query: string,
  signal?: AbortSignal,
): Promise<{ lat: number; lon: number } | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const direct = await searchOnce(trimmed, signal);
  if (direct) return direct;

  // Korean road addresses often end with a "(dong, building name)"
  // suffix — e.g. "서울 광진구 구천면로 20 (광장동, 광진구공연장)" — which
  // Nominatim can't parse and returns zero results for. Stripping it and
  // retrying resolves the address part on its own.
  const withoutParenthetical = trimmed.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (withoutParenthetical && withoutParenthetical !== trimmed) {
    return searchOnce(withoutParenthetical, signal);
  }

  return null;
}
