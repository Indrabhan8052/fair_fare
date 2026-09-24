import Step from './Step.jsx';

// Ported from metroCard(). `detail` is the buildMetroRoute() result (or null).
export default function MetroCard({ fare, detail, from, to }) {
  if (!detail) {
    return (
      <div className="rc">
        <div className="rch">
          <div className="ri metro-ic">🚇</div>
          <div className="rm">
            <div className="rt">Metro Route</div>
            <div className="rst"><span className="rss">No direct metro found</span></div>
          </div>
          <div className="rp">{fare ? `₹${fare}` : '—'}</div>
        </div>
        <div className="sw">
          <Step dot="var(--blue)" hasLine text="No direct metro between these points" tag="Consider bus + metro combination" />
        </div>
      </div>
    );
  }

  if (detail.type === 'direct') {
    const mr = detail;
    const dur = Math.round(mr.totalDist / 0.5);
    const walkFare = Math.round(mr.walkToFrom * 12 + mr.walkFromTo * 12);
    const totalFare = (fare || 0) + walkFare;

    return (
      <div className="rc">
        <div className="rch">
          <div className="ri metro-ic">🚇</div>
          <div className="rm">
            <div className="rt">
              Metro — Direct <span style={{ fontSize: 11, color: mr.line.color, fontWeight: 700, marginLeft: 4 }}>{mr.line.name}</span>
            </div>
            <div className="rst">
              <span className="rss">⏱ ~{Math.round(mr.walkToFrom / 0.08) + dur + Math.round(mr.walkFromTo / 0.08)} min</span>
              <span className="rss">🚉 {mr.numStops} stop{mr.numStops > 1 ? 's' : ''}</span>
              <span className="rss">📏 {mr.totalDist.toFixed(1)} km</span>
            </div>
          </div>
          <div className="rp">₹{totalFare}</div>
        </div>
        <div className="sw">
          <Step dot="var(--muted)" hasLine text={`Walk <b>${mr.walkToFrom.toFixed(1)} km</b> (~${Math.round(mr.walkToFrom / 0.08)} min) from <b>${from.name}</b>`} />
          <Step dot={mr.line.color} hasLine text={`Board at <b>${mr.fromStation.name}</b>`} tag={`${mr.line.name} · Code: ${mr.fromStation.id} · Token ₹${fare}`} />
          <div className="st2">
            <div className="stk"><div className="sd" style={{ background: 'var(--border2)' }} /><div className="sl2" /></div>
            <div>
              <div className="stxt" style={{ color: 'var(--muted)', fontSize: 12 }}>Stops en route:</div>
              <div style={{ marginTop: 4, lineHeight: 1.8 }}>
                {mr.stops.map((s) => <span key={s.id} className="station-chip">{s.name}</span>)}
              </div>
            </div>
          </div>
          <Step dot={mr.line.color} hasLine text={`Alight at <b>${mr.toStation.name}</b>`} tag={`Exit towards ${to.name}`} />
          <Step dot="var(--green)" hasLine={false} text={`Walk <b>${mr.walkFromTo.toFixed(1)} km</b> (~${Math.round(mr.walkFromTo / 0.08)} min) to <b>${to.name}</b>`} />
        </div>
      </div>
    );
  }

  // Transfer route
  const mr = detail;
  return (
    <div className="rc">
      <div className="rch">
        <div className="ri metro-ic">🔀</div>
        <div className="rm">
          <div className="rt">Metro — 1 Transfer</div>
          <div className="rst">
            <span className="rss" style={{ color: mr.lineA.color }}>{mr.lineA.name}</span>
            <span className="rss">→</span>
            <span className="rss" style={{ color: mr.lineB.color }}>{mr.lineB.name}</span>
          </div>
        </div>
        <div className="rp">₹{fare || 20}</div>
      </div>
      <div className="sw">
        <Step dot="var(--muted)" hasLine text={`Walk ~${Math.round(mr.walkToFrom / 0.08)} min to <b>${mr.fromStation.name}</b>`} />
        <Step dot={mr.lineA.color} hasLine text={`Board <b>${mr.lineA.name}</b> at <b>${mr.fromStation.name}</b>`} />
        <div className="st2">
          <div className="stk"><div className="sd" style={{ background: `${mr.lineA.color}88` }} /><div className="sl2" /></div>
          <div>
            <div className="stxt" style={{ fontSize: 11, color: 'var(--muted)' }}>Via:</div>
            <div style={{ marginTop: 3 }}>
              {mr.seg1.map((s) => (
                <span key={s.id} className="station-chip" style={{ borderColor: `${mr.lineA.color}44`, color: mr.lineA.color, background: `${mr.lineA.color}18` }}>{s.name}</span>
              ))}
            </div>
          </div>
        </div>
        <Step dot={mr.lineA.color} hasLine text={`Transfer at <b>${mr.interchange.name}</b>`} tag={`Change to ${mr.lineB.name}`} />
        <Step dot={mr.lineB.color} hasLine text={`Board <b>${mr.lineB.name}</b>`} />
        <div className="st2">
          <div className="stk"><div className="sd" style={{ background: `${mr.lineB.color}88` }} /><div className="sl2" /></div>
          <div>
            <div className="stxt" style={{ fontSize: 11, color: 'var(--muted)' }}>Via:</div>
            <div style={{ marginTop: 3 }}>
              {mr.seg2.map((s) => (
                <span key={s.id} className="station-chip" style={{ borderColor: `${mr.lineB.color}44`, color: mr.lineB.color, background: `${mr.lineB.color}18` }}>{s.name}</span>
              ))}
            </div>
          </div>
        </div>
        <Step dot={mr.lineB.color} hasLine text={`Alight at <b>${mr.toStation.name}</b>`} />
        <Step dot="var(--green)" hasLine={false} text={`Walk ~${Math.round(mr.walkFromTo / 0.08)} min to <b>${to.name}</b>`} />
      </div>
    </div>
  );
}
