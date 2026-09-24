// Ported from step() — one row of the step-by-step journey breakdown.
export default function Step({ dot, hasLine, text, tag }) {
  return (
    <div className="st2">
      <div className="stk">
        <div className="sd" style={{ background: dot }} />
        {hasLine && <div className="sl2" />}
      </div>
      <div>
        <div className="stxt" dangerouslySetInnerHTML={{ __html: text }} />
        {tag && <div className="stag">{tag}</div>}
      </div>
    </div>
  );
}
