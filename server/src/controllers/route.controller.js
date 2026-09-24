import City from '../models/City.js';
import { getDrivingRoute, sampleRouteStops } from '../services/directions.service.js';
import { buildMetroRoute, buildStopsPath } from '../services/routeEngine.js';
import { fares, mockEta } from '../services/fareEngine.js';

// Builds a source -> stops -> destination path for a mode that has no real
// stop dataset (Bus, Taxi/Auto), by sampling points along the road route.
function buildVehiclePath(from, to, coords, distKm, labelPrefix, opts) {
  const stops = sampleRouteStops(coords, distKm, opts);
  return [
    { name: from.name || 'Start', lat: from.lat, lng: from.lng, type: 'source' },
    ...stops.map((s, i) => ({ name: `${labelPrefix} ${i + 1}`, lat: s.lat, lng: s.lng, type: 'stop' })),
    { name: to.name || 'Destination', lat: to.lat, lng: to.lng, type: 'destination' },
  ];
}

// Ported from getRoutes(): given a from/to/city, compute the driving distance
// (real via OSRM, or estimated), then build fare/route options for every mode.
export async function computeRoutes(req, res, next) {
  try {
    const { cityId, from, to } = req.body;
    if (!cityId || !from?.lat || !to?.lat) {
      return res.status(400).json({ message: 'cityId, from and to are required' });
    }

    const city = await City.findOne({ cityId });
    if (!city) return res.status(404).json({ message: 'City not found' });

    const { distKm, durMin, coords, estimated } = await getDrivingRoute(from, to);
    const fareSet = fares(distKm, city);
    const eta = mockEta();

    const hasMetro = city.lines?.length > 0;
    const metroRoute = hasMetro ? buildMetroRoute(from, to, city) : null;

    // pathPoints = the ordered source -> stops -> destination list for THIS trip
    // only (never the whole city network) — this is what the map draws as the
    // highlighted route with pins, same idea as the reference screenshot.
    const metroPathPoints = buildStopsPath(metroRoute, from, to);
    // Bus and Taxi/Auto have no real stop dataset, so their "stops" are sampled
    // along the road route: more/closer for Bus (like a real bus route), fewer
    // for Taxi/Auto (more of a direct ride, but still shows a couple of waypoints).
    const busPathPoints = buildVehiclePath(from, to, coords, distKm, 'Bus Stop', { kmPerStop: 1.5, maxStops: 6 });
    const taxiPathPoints = buildVehiclePath(from, to, coords, distKm, 'Waypoint', { kmPerStop: 4, maxStops: 3 });

    const options = [];
    // Same multipliers/formulas as the original selMode()/comboCard(): buses run
    // ~1.4x the direct driving time, and the mixed bus+auto combo shaves ~15% off that.
    const busDurMin = Math.round(durMin * 1.4);
    const comboFare = Math.round(fareSet.bus * 0.6 + fareSet.auto * 0.5);
    const comboDurMin = Math.round(busDurMin * 0.85);

    if (metroRoute) {
      options.push({
        mode: 'metro',
        fare: fareSet.metro,
        durationMin: durMin,
        detail: metroRoute,
        pathPoints: metroPathPoints,
      });
    }

    options.push({
      mode: 'bus',
      fare: fareSet.bus,
      durationMin: busDurMin,
      detail: { distKm },
      pathPoints: busPathPoints,
    });

    if (metroRoute || distKm > 4) {
      options.push({
        mode: 'combo', // mixed bus + auto route, matches original comboCard()
        fare: comboFare,
        durationMin: comboDurMin,
        detail: { distKm },
        pathPoints: busPathPoints,
      });
    }

    options.push({
      mode: 'taxi',
      fare: { ola: fareSet.ola, uber: fareSet.uber, auto: fareSet.auto, olaAuto: fareSet.olaAuto },
      eta,
      durationMin: durMin,
      detail: { distKm },
      pathPoints: taxiPathPoints,
    });

    res.json({
      distKm,
      durMin,
      coords,
      estimated,
      options,
    });
  } catch (err) {
    next(err);
  }
}