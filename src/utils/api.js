import data from '../data/challans.json'

const GEO_CACHE_KEY = 'ccc_geo_cache_v1';
const GEO_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function loadGeoCache() {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const { value, ts } = JSON.parse(raw);
    if (Date.now() - ts > GEO_TTL_MS) return null; // expired
    return value; // {city, region}
  } catch { return null; }
}
function saveGeoCache(value) {
  try { localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ value, ts: Date.now() })); } catch {}
}

export async function getGeo() {
  // 1) Serve cached value immediately (avoid hitting free quota repeatedly)
  const cached = loadGeoCache();
  if (cached) return cached;

  // 2) Try live fetch with short timeout (so UI doesn’t hang)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500); // 1.5s

  try {
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      // Many free tiers return 429 for quota. Fail gracefully.
      throw new Error(`geo_http_${res.status}`);
    }

    const j = await res.json();
    const city = j.city || '—';
    const region = j.region || j.region_code || '—';

    const value = { city, region };
    saveGeoCache(value);
    return value;
  } catch (e) {
    clearTimeout(timer);
    // 3) Final fallback: mark as unavailable (so header stops “Detecting…”)
    return { unavailable: true };
  }
}

export async function searchChallans(vehicleNo) {
  await new Promise((r) => setTimeout(r, 500));
  const normalize = s => String(s).toUpperCase().replace(/\s+/g,'');
  const entry = data.find(v => normalize(v.vehicleNo) === normalize(vehicleNo));
  if (!entry) return { vehicleNo, challans: [] };
  return { vehicleNo: entry.vehicleNo, challans: entry.challans };
}
