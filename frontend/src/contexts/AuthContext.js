import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

// Provider autenticazione
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carica utente da cache
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Esegue login
  const login = (credentials) => {
    return authApi.login(credentials).then(response => {
      const { accessToken, refreshToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    });
  };

  // Registra utente
  const register = (userData) => {
    return authApi.register(userData).then(response => {
      const { accessToken, refreshToken, user: newUser } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    });
  };

  // Esegue logout
  const logout = () => {
    return authApi.logout()
      .catch(err => {
        console.error('Logout error:', err);
      })
      .finally(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      });
  };

  // Aggiorna cache utente
  const updateUser = (newUserData) => {
    const mergedUser = { ...user, ...newUserData };
    localStorage.setItem('user', JSON.stringify(mergedUser));
    setUser(mergedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook globale
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
