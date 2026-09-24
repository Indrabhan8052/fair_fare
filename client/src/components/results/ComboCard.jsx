import Step from './Step.jsx';

// Ported from comboCard()
export default function ComboCard({ distKm, durationMin, fare, busShare, autoShare, from, to }) {
  return (
    <div className="rc">
      <div className="rch combo-border">
        <div className="ri combo-ic">⚡</div>
        <div className="rm">
          <div className="rt">Mixed Route</div>
          <div className="rst"><span className="rss">⏱ ~{durationMin} min</span><span className="rss">🔀 Bus + Auto</span></div>
        </div>
        <div className="rp combo-price">₹{fare}</div>
      </div>
      <div className="sw">
        <Step dot="var(--green)" hasLine text={`Board City Bus from <b>${from.name}</b>`} tag={`₹${busShare} approx`} />
        <Step dot="var(--amber)" hasLine text="Alight at midpoint / major junction" />
        <Step dot="var(--blue)" hasLine={false} text={`Take Auto-Rickshaw to <b>${to.name}</b>`} tag={`₹${autoShare} approx`} />
      </div>
    </div>
  );
}
