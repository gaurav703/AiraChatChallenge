import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored user data on app start
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  const login = async (email, password, rememberMe) => {
    // Mock authentication
    if (email === 'test@aira.ai' && password === 'password') {
      setIsAuthenticated(true);
      const loggedUser = { email };
      setUser(loggedUser);

      // Store user only if rememberMe is true
      if (rememberMe) {
        await AsyncStorage.setItem('user', JSON.stringify(loggedUser));
      }

      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
