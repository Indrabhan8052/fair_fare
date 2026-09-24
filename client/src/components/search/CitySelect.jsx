export default function CitySelect({ cities, value, onChange }) {
  return (
    <select className="city-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>Select a city</option>
      {cities.map((c) => (
        <option key={c.cityId} value={c.cityId}>{c.name}</option>
      ))}
    </select>
  );
}
