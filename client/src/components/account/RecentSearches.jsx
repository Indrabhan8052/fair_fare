// Ported from renderRecent()/getAgo()
function getAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentSearches({ items, onReload, onDelete }) {
  if (!items?.length) {
    return <div className="uc">No recent searches yet.</div>;
  }
  return (
    <div className="recent-list">
      {items.map((r) => (
        <div key={r._id} className="recent-item" onClick={() => onReload(r)}>
          <div className="recent-route">{r.from.name} → {r.to.name}</div>
          <div className="recent-meta">
            <span>{r.durationMin} min</span>
            <span>{getAgo(r.createdAt)}</span>
          </div>
          <button
            type="button"
            className="recent-delete"
            onClick={(e) => { e.stopPropagation(); onDelete(r._id); }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
