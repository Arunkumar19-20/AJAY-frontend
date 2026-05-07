import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pmajay_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('pmajay_user');
        localStorage.removeItem('pmajay_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Clear any stale tokens before login
    localStorage.removeItem('pmajay_token');
    localStorage.removeItem('pmajay_user');

    const response = await fetch('https://ajay-backend-1.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Login failed');
    }

    const userData = await response.json();
    localStorage.setItem('pmajay_token', userData.token);
    localStorage.setItem('pmajay_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const userData = res.data;
    localStorage.setItem('pmajay_token', userData.token);
    localStorage.setItem('pmajay_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('pmajay_token');
    localStorage.removeItem('pmajay_user');
    setUser(null);
  };

  const hasRole = (role) => user?.role === role;
  const isCentre = () => hasRole('CENTRE');
  const isState = () => hasRole('STATE');
  const isAgency = () => hasRole('AGENCY');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      hasRole,
      isCentre,
      isState,
      isAgency,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
