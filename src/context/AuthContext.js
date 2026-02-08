// admin-panel/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../api/client';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedToken = storage.getToken();
      const savedUser = storage.getUser();

      if (savedToken && savedUser) {
        // Verify token
        const response = await api.getMe();
        if (response.success && response.data.user.role === 'admin') {
          setToken(savedToken);
          setUser(response.data.user);
        } else {
          storage.clearAll();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      storage.clearAll();
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await api.login(phone, password);

      if (response.success && response.data.user.role === 'admin') {
        const { token, user } = response.data;

        storage.saveToken(token);
        storage.saveUser(user);

        setToken(token);
        setUser(user);

        return { success: true };
      }

      return { success: false, message: 'Зөвхөн админ нэвтэрч болно' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Нэвтрэх амжилтгүй',
      };
    }
  };

  const logout = () => {
    storage.clearAll();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};