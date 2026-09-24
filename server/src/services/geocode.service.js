import fetch from 'node-fetch';

// Server-side proxy to OSM Nominatim (same source the original app used client-side).
// Proxying keeps the required Nominatim usage-policy headers server-controlled and
// keeps this off the browser's network tab.
export async function searchPlaces(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'FairFare/1.0 (contact: set-your-contact-email)' },
  });
  if (!res.ok) throw new Error('Geocoding service unavailable');
  const data = await res.json();
  return data.map((p) => ({
    name: p.display_name,
    lat: parseFloat(p.lat),
    lng: parseFloat(p.lon),
  }));
}
