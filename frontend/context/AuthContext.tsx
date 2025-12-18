'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authAPI } from '../lib/auth';
import Cookie from 'js-cookie';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = Cookie.get('accessToken');
    if (token) {
      setAccessToken(token);
      // Decode the token to restore user data (JWT tokens have payload in the middle part)
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadStr = atob(payloadBase64);
        const payload = JSON.parse(payloadStr);
        // Set user from token payload
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role as 'CUSTOMER' | 'ADMIN',
          firstName: '', // Not in JWT, will be empty
          lastName: ''   // Not in JWT, will be empty
        });
      } catch (err) {
        console.error('Failed to decode token:', err);
        // If token is invalid, clear it
        Cookie.remove('accessToken');
        setAccessToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      setAccessToken(response.accessToken);
      setUser(response.user);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(email, password, firstName, lastName);
      setAccessToken(response.accessToken);
      setUser(response.user);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setAccessToken(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
