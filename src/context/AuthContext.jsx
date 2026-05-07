import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

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

      // Clear old auth data
      localStorage.removeItem('pmajay_user');
      localStorage.removeItem('pmajay_token');

      // Login request
      const response = await authAPI.login({
        email,
        password,
      });

      const userData = response.data;

      // Validate token
      if (!userData.token) {
        throw new Error('Token not received from server');
      }

      // Save auth data
      localStorage.setItem(
        'pmajay_token',
        userData.token
      );

      localStorage.setItem(
        'pmajay_user',
        JSON.stringify(userData)
      );

      // Update state
      setUser(userData);

      return userData;

    } catch (err) {

      console.error('LOGIN ERROR:', err);

      throw new Error(
        err.response?.data?.message ||
        err.message ||
        'Login failed'
      );
    }
  };

  // REGISTER
  const register = async (data) => {

    try {

      const response = await authAPI.register(data);

      const userData = response.data;

      // Save auth data
      localStorage.setItem(
        'pmajay_token',
        userData.token
      );

      localStorage.setItem(
        'pmajay_user',
        JSON.stringify(userData)
      );

      // Update state
      setUser(userData);

      return userData;

    } catch (err) {

      console.error('REGISTER ERROR:', err);

      throw new Error(
        err.response?.data?.message ||
        err.message ||
        'Registration failed'
      );
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem('pmajay_user');
    localStorage.removeItem('pmajay_token');

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