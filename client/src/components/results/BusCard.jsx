import Step from './Step.jsx';

// Ported from busCard()
export default function BusCard({ distKm, durationMin, fare, from, to }) {
  return (
    <div className="rc">
      <div className="rch">
        <div className="ri bus-ic">🚌</div>
        <div className="rm">
          <div className="rt">City Bus</div>
          <div className="rst"><span className="rss">⏱ ~{durationMin} min</span><span className="rss">📏 {distKm.toFixed(1)} km</span></div>
        </div>
        <div className="rp">₹{fare}</div>
      </div>
      <div className="sw">
        <Step dot="var(--green)" hasLine text={`Walk to nearest City Bus stop near <b>${from.name}</b>`} />
        <Step dot="var(--green)" hasLine text={`Board bus towards <b>${to.name}</b>`} tag={`₹${fare} · Pay conductor · ~${Math.round(distKm / 0.5)} stops`} />
        <Step dot="var(--blue)" hasLine={false} text={`Alight at stop closest to <b>${to.name}</b>`} />
      </div>
      <div className="rftr"><span className="eco">🌿 {(distKm * 0.065).toFixed(2)} kg CO₂</span></div>
    </div>
  );
}
