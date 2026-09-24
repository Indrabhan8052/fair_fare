// Ported from the original script.js: hav(), findNearestStation(), buildMetroRoute()
// Now reads station/line data from a City document (MongoDB) instead of the
// hardcoded METRO constant.

export function haversine(la1, lo1, la2, lo2) {
  const R = 6371;
  const dLa = (la2 - la1) * Math.PI / 180;
  const dLo = (lo2 - lo1) * Math.PI / 180;
  const a =
    Math.sin(dLa / 2) ** 2 +
    Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestStation(lat, lng, city) {
  if (!city) return null;
  let best = null;
  let bestDist = 999;
  city.lines.forEach((line) => {
    line.stations.forEach((st) => {
      const d = haversine(lat, lng, st.lat, st.lng);
      if (d < bestDist) {
        bestDist = d;
        best = { station: st, line, dist: d };
      }
    });
  });
  return best;
}

// Returns a 'direct' route (same line) or 'transfer' route (interchange between
// two lines), or null if either endpoint is too far (>3km) from the metro network
// or no connecting path exists.
export function buildMetroRoute(from, to, city) {
  if (!city || !city.lines?.length) return null;

  const nearFrom = findNearestStation(from.lat, from.lng, city);
  const nearTo = findNearestStation(to.lat, to.lng, city);
  if (!nearFrom || !nearTo) return null;
  if (nearFrom.dist > 3 || nearTo.dist > 3) return null;

  let sameLine = null, fromIdx = -1, toIdx = -1;
  city.lines.forEach((line) => {
    const fi = line.stations.findIndex((s) => s.id === nearFrom.station.id);
    const ti = line.stations.findIndex((s) => s.id === nearTo.station.id);
    if (fi !== -1 && ti !== -1) {
      sameLine = line;
      fromIdx = fi;
      toIdx = ti;
    }
  });

  if (sameLine) {
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    const stopsOnRoute = sameLine.stations.slice(start, end + 1);
    const numStops = stopsOnRoute.length - 1;
    const totalDist = stopsOnRoute.reduce(
      (acc, st, i) => (i === 0 ? acc : acc + haversine(stopsOnRoute[i - 1].lat, stopsOnRoute[i - 1].lng, st.lat, st.lng)),
      0
    );
    return {
      type: 'direct',
      line: sameLine,
      fromStation: nearFrom.station,
      toStation: nearTo.station,
      walkToFrom: nearFrom.dist,
      walkFromTo: nearTo.dist,
      stops: stopsOnRoute,
      numStops,
      totalDist,
    };
  }

  // Try to find an interchange station shared by two different lines
  for (const lineA of city.lines) {
    for (const lineB of city.lines) {
      if (lineA.id === lineB.id) continue;
      for (const stA of lineA.stations) {
        for (const stB of lineB.stations) {
          if (stA.id !== stB.id) continue;

          const fiA = lineA.stations.findIndex((s) => s.id === nearFrom.station.id);
          const interA = lineA.stations.findIndex((s) => s.id === stA.id);
          const interB = lineB.stations.findIndex((s) => s.id === stB.id);
          const tiB = lineB.stations.findIndex((s) => s.id === nearTo.station.id);

          if (fiA !== -1 && interA !== -1 && interB !== -1 && tiB !== -1) {
            const seg1 = lineA.stations.slice(Math.min(fiA, interA), Math.max(fiA, interA) + 1);
            const seg2 = lineB.stations.slice(Math.min(interB, tiB), Math.max(interB, tiB) + 1);
            return {
              type: 'transfer',
              lineA,
              lineB,
              interchange: { station: stA, name: stA.name },
              fromStation: nearFrom.station,
              toStation: nearTo.station,
              walkToFrom: nearFrom.dist,
              walkFromTo: nearTo.dist,
              seg1,
              seg2,
            };
          }
        }
      }
    }
  }
  return null;
}

// Builds the ordered list of points to actually draw on the map for a metro
// journey: source -> board station -> intermediate stops -> (transfer if any)
// -> alight station -> destination. This is what makes the map show only the
// stops relevant to *this* trip, in travel direction, instead of the whole
// city network.
export function buildStopsPath(metroRoute, from, to) {
  const sourcePoint = { name: from.name || 'Start', lat: from.lat, lng: from.lng, type: 'source' };
  const destPoint = { name: to.name || 'Destination', lat: to.lat, lng: to.lng, type: 'destination' };

  if (!metroRoute) return [sourcePoint, destPoint];

  if (metroRoute.type === 'direct') {
    const line = metroRoute.line;
    const fromIdx = line.stations.findIndex((s) => s.id === metroRoute.fromStation.id);
    const toIdx = line.stations.findIndex((s) => s.id === metroRoute.toStation.id);
    let stops = metroRoute.stops.slice();
    if (fromIdx > toIdx) stops = stops.reverse(); // orient stops from source towards destination

    return [
      sourcePoint,
      ...stops.map((s, i) => ({
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        type: i === 0 ? 'board' : i === stops.length - 1 ? 'alight' : 'stop',
        line: line.name,
        color: line.color,
      })),
      destPoint,
    ];
  }

  // Transfer route: two segments joined at the interchange station
  const { lineA, lineB, interchange } = metroRoute;
  const fiA = lineA.stations.findIndex((s) => s.id === metroRoute.fromStation.id);
  const interA = lineA.stations.findIndex((s) => s.id === interchange.station.id);
  let seg1 = metroRoute.seg1.slice();
  if (fiA > interA) seg1 = seg1.reverse();

  const interB = lineB.stations.findIndex((s) => s.id === interchange.station.id);
  const tiB = lineB.stations.findIndex((s) => s.id === metroRoute.toStation.id);
  let seg2 = metroRoute.seg2.slice();
  if (interB > tiB) seg2 = seg2.reverse();

  return [
    sourcePoint,
    ...seg1.map((s, i) => ({
      name: s.name, lat: s.lat, lng: s.lng,
      type: i === 0 ? 'board' : 'stop',
      line: lineA.name, color: lineA.color,
    })),
    // seg1's last entry is the interchange itself; skip seg2's first entry (same station) to avoid a duplicate pin
    ...seg2.slice(1).map((s, i, arr) => ({
      name: s.name, lat: s.lat, lng: s.lng,
      type: i === arr.length - 1 ? 'alight' : 'stop',
      line: lineB.name, color: lineB.color,
    })),
    destPoint,
  ];
}
