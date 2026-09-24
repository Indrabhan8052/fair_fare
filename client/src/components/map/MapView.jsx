import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

// Only draws what's relevant to the CURRENT trip — the source/destination and
// the stops actually used to get between them — instead of the whole city's
// metro network. `activePath` is the ordered pathPoints array for whichever
// mode tab is selected (see route.controller.js's buildStopsPath output):
// [{ name, lat, lng, type: 'source'|'board'|'stop'|'alight'|'destination', color? }]
export default function MapView({ center, zoom = 12, route, activePath, from, to }) {
  const pinColor = (type) => {
    if (type === 'source') return '#12b76a';
    if (type === 'destination') return '#ef4444';
    if (type === 'board' || type === 'alight') return '#1a6ef5';
    return '#f59e0b'; // intermediate stop
  };

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Actual road/driving route, for context (dashed if it's an estimate, not a real routed path) */}
      {route?.coords?.length > 0 && (
        <Polyline
          positions={route.coords.map(([lng, lat]) => [lat, lng])}
          pathOptions={{ color: '#1a6ef5', weight: 4, opacity: 0.55, dashArray: route.estimated ? '6 8' : null }}
        />
      )}

      {/* The trip's own path: source -> stops -> destination, for the selected mode only */}
      {activePath?.length > 1 && (
        <Polyline
          positions={activePath.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: '#e11d48', weight: 5, opacity: 0.9 }}
        />
      )}

      {activePath?.map((p, i) => (
        <Marker key={`${p.name}-${i}`} position={[p.lat, p.lng]}>
          <Popup>
            <b>{p.name}</b>
            {p.line ? <><br />{p.line}</> : null}
          </Popup>
        </Marker>
      ))}

      {/* Before a route is searched, just show plain source/destination pins */}
      {!activePath && from && <Marker position={[from.lat, from.lng]}><Popup>From: {from.name}</Popup></Marker>}
      {!activePath && to && <Marker position={[to.lat, to.lng]}><Popup>To: {to.name}</Popup></Marker>}
    </MapContainer>
  );
}
