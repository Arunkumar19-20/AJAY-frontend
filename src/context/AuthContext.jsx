import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API_URL = 'https://ajay-backend-1.onrender.com/api/auth/login';

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {

    const storedUser = localStorage.getItem('pmajay_user');
    const storedToken = localStorage.getItem('pmajay_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);

        localStorage.removeItem('pmajay_user');
        localStorage.removeItem('pmajay_token');
      }
    }

    setLoading(false);

  }, []);

  // LOGIN
  const login = async (email, password) => {

    try {

      // Clear old data
      localStorage.removeItem('pmajay_user');
      localStorage.removeItem('pmajay_token');

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Get raw response text first
      const text = await response.text();

      let data = {};

      // Safely parse JSON
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Invalid JSON response:', text);
        throw new Error('Server returned invalid response');
      }

      // Handle API errors
      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          'Login failed'
        );
      }

      // Validate token
      if (!data.token) {
        throw new Error('Token not received from server');
      }

      // Save auth data
      localStorage.setItem('pmajay_token', data.token);
      localStorage.setItem('pmajay_user', JSON.stringify(data));

      setUser(data);

      return data;

    } catch (err) {

      console.error('LOGIN ERROR:', err);

      throw err;
    }
  };

  // REGISTER
  const register = async (data) => {

    try {

      const res = await authAPI.register(data);

      const userData = res.data;

      localStorage.setItem(
        'pmajay_token',
        userData.token
      );

      localStorage.setItem(
        'pmajay_user',
        JSON.stringify(userData)
      );

      setUser(userData);

      return userData;

    } catch (err) {

      console.error('REGISTER ERROR:', err);

      throw err;
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem('pmajay_token');
    localStorage.removeItem('pmajay_user');

    setUser(null);
  };

  // ROLE HELPERS
  const hasRole = (role) => user?.role === role;

  const isCentre = () => hasRole('CENTRE');

  const isState = () => hasRole('STATE');

  const isAgency = () => hasRole('AGENCY');

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}