import fetch from 'node-fetch';
import { haversine } from './routeEngine.js';

function timeoutFetch(url, ms = 6000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

// Straight bezier curve between two points — used only as a visual fallback
// on the map when a real driving route can't be fetched.
export function bezierCurve(from, to, n = 50) {
  const ml = (from.lat + to.lat) / 2 + (to.lng - from.lng) * 0.09;
  const mg = (from.lng + to.lng) / 2 - (to.lat - from.lat) * 0.09;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return [
      (1 - t) ** 2 * from.lng + 2 * (1 - t) * t * mg + t ** 2 * to.lng,
      (1 - t) ** 2 * from.lat + 2 * (1 - t) * t * ml + t ** 2 * to.lat,
    ];
  });
}

// Ported from getRoutes(): try OSRM's public driving-route API first, fall back
// to a haversine-based estimate + bezier curve if it's unavailable.
export async function getDrivingRoute(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await timeoutFetch(url, 6000);
    const d = await res.json();
    if (d.code === 'Ok' && d.routes?.length) {
      return {
        distKm: d.routes[0].distance / 1000,
        durMin: Math.round(d.routes[0].duration / 60),
        coords: d.routes[0].geometry.coordinates,
        estimated: false,
      };
    }
    throw new Error('OSRM returned no route');
  } catch {
    const straight = haversine(from.lat, from.lng, to.lat, to.lng);
    const distKm = +(straight * 1.35).toFixed(2);
    const durMin = Math.max(3, Math.round((distKm / 25) * 60));
    return { distKm, durMin, coords: bezierCurve(from, to), estimated: true };
  }
}

// Picks evenly-spaced points along an already-computed route (OSRM coords or the
// bezier fallback) to stand in as stops, since Bus/Taxi don't have a real
// stop/waypoint dataset the way the metro does. More stops for Bus (closer
// together, like a real bus route), fewer for Taxi/Auto (more direct).
export function sampleRouteStops(coords, distKm, { minStops = 1, maxStops = 6, kmPerStop = 1.8 } = {}) {
  if (!coords || coords.length < 3 || !distKm) return [];
  let count = Math.round(distKm / kmPerStop);
  count = Math.max(minStops, Math.min(maxStops, count));

  const stops = [];
  for (let i = 1; i <= count; i++) {
    const idx = Math.round((i / (count + 1)) * (coords.length - 1));
    const [lng, lat] = coords[idx];
    stops.push({ lat, lng });
  }
  return stops;
}