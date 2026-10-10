import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from './api.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [checking, setChecking] = useState(!!localStorage.getItem('token'));

  const save = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Validate a stored token once on load so an expired session does not look logged in.
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api
      .get('/api/auth/me')
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
      })
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, [logout]);

  const login = async (email, password) => save((await api.post('/api/auth/login', { email, password })).data);
  const register = async (payload) => save((await api.post('/api/auth/register', payload)).data);

  return (
    <AuthContext.Provider value={{ user, checking, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
