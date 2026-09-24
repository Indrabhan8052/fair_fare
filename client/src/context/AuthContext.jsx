import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ff_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('ff_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authApi.login({ email, password });
    localStorage.setItem('ff_token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function signup(payload) {
    const data = await authApi.signup(payload);
    localStorage.setItem('ff_token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('ff_token');
    setUser(null);
  }

  async function refreshUser(patch) {
    const data = await authApi.updateMe(patch);
    setUser(data.user);
    return data.user;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
