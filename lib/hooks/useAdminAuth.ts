'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authToken = localStorage.getItem('adminAuth');
    if (authToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const login = (username: string, password: string): boolean => {
    // Simple client-side check (in production, this should be server-side)
    const adminUsername = 'admin';
    const adminPassword = 'admin123';

    if (username === adminUsername && password === adminPassword) {
      const token = btoa(`${username}:${password}`);
      localStorage.setItem('adminAuth', token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const getAuthHeader = (): string | null => {
    const token = localStorage.getItem('adminAuth');
    return token ? `Basic ${token}` : null;
  };

  return { isAuthenticated, isLoading, login, logout, getAuthHeader };
}
