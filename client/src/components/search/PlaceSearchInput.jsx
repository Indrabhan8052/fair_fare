import { useEffect, useState } from 'react';

// Ported from onSearch()/pickPlace(), now restricted to the selected city only.
// Suggestions come solely from `cityPlaces` (the current city's own location
// list) — no external/nationwide geocoding — so switching cities automatically
// restricts what shows up here.
export default function PlaceSearchInput({ label, placeholder, cityPlaces = [], value, onSelect }) {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      cityPlaces
        .filter((p) => p.name.toLowerCase().includes(q))
        .slice(0, 8)
        .map((p) => ({ name: p.name, lat: p.lat, lng: p.lng }))
    );
  }, [query, cityPlaces]);

  function pick(place) {
    setQuery(place.name);
    setOpen(false);
    onSelect(place);
  }

  return (
    <div className="place-search">
      <label>{label}</label>
      <input
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <ul className="place-search-results">
          {results.map((r, i) => (
            <li key={i} onClick={() => pick(r)}>
              {r.name}
            </li>
          ))}
        </ul>
      )}
      {open && query.trim().length > 0 && results.length === 0 && (
        <ul className="place-search-results">
          <li style={{ color: 'var(--muted)', cursor: 'default' }}>No matching location in this city</li>
        </ul>
      )}
    </div>
  );
}