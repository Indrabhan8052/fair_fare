// Ported from the original script.js fares()/eta(). Same fare curves.
// NOTE: the original eta() for Ola/Uber/auto was randomized (Math.random()) —
// it was never real live data, just a UI placeholder. Kept as an explicit mock
// here rather than silently pretending it's a real cab-availability integration.

export function fares(distKm, city) {
  const bus = Math.round(Math.max(10, 8 + distKm * 2.2));
  const auto = Math.round(distKm <= 1.5 ? 30 : 30 + (distKm - 1.5) * 12);

  let metro = null;
  if (city?.lines?.length) {
    metro =
      distKm <= 2 ? 10 :
      distKm <= 5 ? 15 :
      distKm <= 12 ? 20 :
      distKm <= 21 ? 30 : 40;
  }

  return {
    bus,
    auto,
    metro,
    ola: Math.round(49 + Math.max(0, distKm - 2) * 11),
    uber: Math.round(49 + Math.max(0, distKm - 2) * 12),
    olaAuto: Math.round(25 + distKm * 9),
  };
}

// Mock ETA — replace with a real cab-aggregator API if/when you have one.
export function mockEta() {
  return {
    ola: `${2 + Math.floor(Math.random() * 5)} min`,
    uber: `${3 + Math.floor(Math.random() * 5)} min`,
    auto: `${1 + Math.floor(Math.random() * 3)} min`,
  };
}
