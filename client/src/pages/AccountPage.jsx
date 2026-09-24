import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AvatarPicker from '../components/account/AvatarPicker.jsx';
import RecentSearches from '../components/account/RecentSearches.jsx';
import * as historyApi from '../api/history.api.js';

// Ported from renderAccount()/openEP()/togPref()
export default function AccountPage() {
  const { user, logout, refreshUser } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '😊');
  const [prefs, setPrefs] = useState(user?.preferences || { metro: true, bus: true, taxi: true });
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    historyApi.listHistory().then(setHistory).catch(() => {});
  }, []);

  function togPref(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  async function save() {
    await refreshUser({ avatar, preferences: prefs });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function deleteItem(id) {
    await historyApi.deleteHistory(id);
    setHistory((h) => h.filter((i) => i._id !== id));
  }

  if (!user) return null;

  return (
    <div className="account-page">
      <h1>Account</h1>

      <section className="account-section">
        <div className="account-avatar-big">{avatar}</div>
        <div className="account-name">{user.name}</div>
        <div className="account-email">{user.email}</div>
      </section>

      <section className="account-section">
        <h2>Avatar</h2>
        <AvatarPicker value={avatar} onChange={setAvatar} />
      </section>

      <section className="account-section">
        <h2>Preferred transport modes</h2>
        <div className="pref-toggles">
          {['metro', 'bus', 'taxi'].map((k) => (
            <label key={k} className="pref-toggle">
              <input type="checkbox" checked={prefs[k]} onChange={() => togPref(k)} />
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </label>
          ))}
        </div>
      </section>

      <button className="auth-btn" onClick={save}>{saved ? 'Saved ✓' : 'Save changes'}</button>

      <section className="account-section">
        <h2>Recent searches</h2>
        <RecentSearches items={history} onReload={() => {}} onDelete={deleteItem} />
      </section>

      <button className="auth-sec" onClick={logout}>Log out</button>
    </div>
  );
}
