import Step from './Step.jsx';

// Ported from taxiCard(), enhanced to walk through every sampled waypoint
// (pathPoints, from route.controller.js's buildVehiclePath) and describe each
// leg of the ride, the same step-by-step pattern MetroCard/BusCard already use.
export default function TaxiCard({ distKm, durationMin, fare, eta, from, to, pathPoints = [] }) {
  // pathPoints = [source, ...waypoints, destination]; build one "Travel from A to B" line per leg
  const legs = [];
  for (let i = 0; i < pathPoints.length - 1; i++) {
    legs.push({ a: pathPoints[i], b: pathPoints[i + 1] });
  }

  return (
    <div className="rc">
      <div className="rch">
        <div className="ri taxi-ic">🚕</div>
        <div className="rm">
          <div className="rt">Taxi &amp; Auto Options</div>
          <div className="rst"><span className="rss">⏱ ~{durationMin} min</span><span className="rss">🛣 {distKm.toFixed(1)} km</span></div>
        </div>
      </div>
      <div className="cr">
        <div className="co"><div className="cem">🟢</div><div className="cn2">Ola Mini</div><div className="cp">₹{fare.ola}</div><div className="ceta">ETA {eta.ola}</div></div>
        <div className="co"><div className="cem">⬛</div><div className="cn2">Uber Go</div><div className="cp">₹{fare.uber}</div><div className="ceta">ETA {eta.uber}</div></div>
        <div className="co"><div className="cem">🛺</div><div className="cn2">Auto</div><div className="cp">₹{fare.auto}</div><div className="ceta">ETA {eta.auto}</div></div>
      </div>

      <div className="sw" style={{ paddingTop: 0 }}>
        {legs.length > 0 ? (
          legs.map((leg, i) => (
            <Step
              key={i}
              dot={i === 0 ? 'var(--green)' : i === legs.length - 1 ? 'var(--red)' : 'var(--cyan)'}
              hasLine={i < legs.length - 1}
              text={`Travel from <b>${leg.a.name}</b> to <b>${leg.b.name}</b>`}
              tag={i === 0 ? `Pickup from ${from.name}` : i === legs.length - 1 ? `Drop at ${to.name}` : null}
            />
          ))
        ) : (
          <Step dot="var(--cyan)" hasLine={false} text={`Direct ride from <b>${from.name}</b> to <b>${to.name}</b>`} />
        )}
      </div>

      <div className="rftr" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Surge pricing may apply · Ola Auto: ₹{fare.olaAuto} · Shared Auto: ₹{Math.round(fare.auto * 0.45)}</span>
        <span className="eco eco-red">🔥 {(distKm * 0.12).toFixed(2)} kg CO₂</span>
      </div>
    </div>
  );
}