import { useEffect, useState } from 'react';
import CitySelect from '../components/search/CitySelect.jsx';
import PlaceSearchInput from '../components/search/PlaceSearchInput.jsx';
import MapView from '../components/map/MapView.jsx';
import MetroCard from '../components/results/MetroCard.jsx';
import BusCard from '../components/results/BusCard.jsx';
import ComboCard from '../components/results/ComboCard.jsx';
import TaxiCard from '../components/results/TaxiCard.jsx';
import * as citiesApi from '../api/cities.api.js';
import * as routesApi from '../api/routes.api.js';
import * as historyApi from '../api/history.api.js';
import { formatDistance, formatDuration } from '../utils/geo.js';
import { useAuth } from '../context/AuthContext.jsx';

// Ported from boot()/selectCity()/getRoutes()/selMode() — the main planner screen.
export default function HomePage() {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState('');
  const [city, setCity] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [mode, setMode] = useState('metro'); // metro | bus | taxi — matches original tab bar
  const [result, setResult] = useState(null); // { distKm, durMin, coords, options }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    citiesApi.listCities().then(setCities).catch(() => setError('Could not load cities'));
  }, []);

  useEffect(() => {
    if (!cityId) return;
    citiesApi.getCity(cityId).then(setCity).catch(() => setError('Could not load city data'));
    setFrom(null);
    setTo(null);
    setResult(null);
  }, [cityId]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  async function findRoutes() {
    if (!from || !to || !cityId) return;
    setLoading(true);
    setError('');
    try {
      const data = await routesApi.computeRoutes({ cityId, from, to });
      setResult(data);
      setMode(data.options.some((o) => o.mode === 'metro') ? 'metro' : 'bus');

      if (user) {
        historyApi.addHistory({ cityId, from, to, durationMin: data.durMin }).catch(() => {});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not compute routes');
    } finally {
      setLoading(false);
    }
  }

  const visibleOptions = result?.options.filter((o) => {
    if (mode === 'metro') return o.mode === 'metro' || o.mode === 'combo';
    if (mode === 'bus') return o.mode === 'bus' || o.mode === 'combo';
    return o.mode === 'taxi';
  });

  const hasMetro = result?.options.some((o) => o.mode === 'metro');

  // The map only ever shows the path for whichever mode tab is active — never
  // the whole city network — so it always matches what the person is reading
  // in the cards below it.
  const activeOption =
    result?.options.find((o) => o.mode === mode) ||
    result?.options.find((o) => o.mode === 'combo' && (mode === 'metro' || mode === 'bus'));
  const activePath = activeOption?.pathPoints || null;

  return (
    <div className="home-page">
      <div className="planner-panel">
        <h1>Fair Fare</h1>
        <p className="tagline">One transparent fare, every route option.</p>

        <CitySelect cities={cities} value={cityId} onChange={setCityId} />

        {city && (
          <>
            <PlaceSearchInput
              label="From"
              placeholder="Starting point"
              cityPlaces={city.places}
              value={from}
              onSelect={setFrom}
            />
            <button type="button" className="swap-btn" onClick={swap} disabled={!from && !to}>⇅</button>
            <PlaceSearchInput
              label="To"
              placeholder="Destination"
              cityPlaces={city.places}
              value={to}
              onSelect={setTo}
            />

            <button className="go-btn" onClick={findRoutes} disabled={!from || !to || loading}>
              {loading ? 'Finding routes…' : result ? 'Update Routes' : 'Find Routes'}
            </button>
          </>
        )}

        {error && <div className="auth-error">{error}</div>}

        {result && (
          <div className="dist-banner">
            <span>{formatDistance(result.distKm)}</span>
            <span>{formatDuration(result.durMin)}</span>
            <span>₹{Math.min(...result.options.filter((o) => typeof o.fare === 'number').map((o) => o.fare))}</span>
          </div>
        )}

        {result && (
          <div className="mode-tabs">
            {hasMetro && <button className={mode === 'metro' ? 'tb s' : 'tb'} onClick={() => setMode('metro')}>Metro</button>}
            <button className={mode === 'bus' ? 'tb s' : 'tb'} onClick={() => setMode('bus')}>Bus</button>
            <button className={mode === 'taxi' ? 'tb s' : 'tb'} onClick={() => setMode('taxi')}>Taxi</button>
          </div>
        )}

        <div className="results-list">
          {visibleOptions?.map((opt, i) => {
            if (opt.mode === 'metro') {
              return <MetroCard key={i} fare={opt.fare} detail={opt.detail} from={from} to={to} />;
            }
            if (opt.mode === 'bus') {
              return <BusCard key={i} distKm={opt.detail.distKm} durationMin={opt.durationMin} fare={opt.fare} from={from} to={to} />;
            }
            if (opt.mode === 'combo') {
              const busShare = Math.round(opt.fare * 0.545); // display split, ~matches original bus*.6/auto*.5 ratio
              const autoShare = opt.fare - busShare;
              return (
                <ComboCard
                  key={i}
                  distKm={opt.detail.distKm}
                  durationMin={opt.durationMin}
                  fare={opt.fare}
                  busShare={busShare}
                  autoShare={autoShare}
                  from={from}
                  to={to}
                />
              );
            }
            if (opt.mode === 'taxi') {
              return <TaxiCard key={i} distKm={opt.detail.distKm} durationMin={opt.durationMin} fare={opt.fare} eta={opt.eta} from={from} to={to} pathPoints={opt.pathPoints} />;
            }
            return null;
          })}
        </div>
      </div>

      <div className="map-panel">
        {city && (
          <MapView
            center={city.center}
            zoom={city.zoom}
            route={result}
            activePath={activePath}
            from={from}
            to={to}
          />
        )}
        {!city && <div className="map-placeholder">Pick a city to see the map</div>}
      </div>
    </div>
  );
}