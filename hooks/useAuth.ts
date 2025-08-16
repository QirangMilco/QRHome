'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setHasPassword(AuthService.hasPassword());
      setIsAuthenticated(AuthService.isAuthenticated());
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (password: string, rememberMe: boolean = false): Promise<boolean> => {
    const isValid = await AuthService.verifyPassword(password);
    if (isValid) {
      AuthService.login(rememberMe);
      setIsAuthenticated(true);
    }
    return isValid;
  };

  const setPassword = async (password: string): Promise<void> => {
    await AuthService.setPassword(password);
    setHasPassword(true);
    AuthService.login(true);
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    hasPassword,
    login,
    setPassword,
    logout
  };
}