import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AvatarPicker from '../components/account/AvatarPicker.jsx';

// Ported from authFormHTML() (signup mode) + submitEmailAuth() signup branch
// Note: email/SMS OTP verification was dropped for this v1 (see migration plan) —
// signup creates the account directly, matching the "JWT-only" scope decision.
export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', avatar: '😊' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="auth-sub">Join Fair Fare</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Name</label>
        <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />

        <label>Email</label>
        <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />

        <label>Password</label>
        <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="At least 6 characters" />

        <label>Pick an avatar</label>
        <AvatarPicker value={form.avatar} onChange={(av) => update('avatar', av)} />

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>

        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
