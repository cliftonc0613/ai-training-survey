'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { localStorage as storage, STORAGE_KEYS } from '../utils/storage';
import { db } from '../supabaseClient';
import { generateResumeToken, validateResumeToken } from '../utils/resume-token';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: Omit<User, 'id' | 'resumeToken' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  logout: () => void;
  resumeSession: (token: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = storage.get<User>(STORAGE_KEYS.CURRENT_USER);
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
      storage.set(STORAGE_KEYS.RESUME_TOKEN, user.resumeToken);
    } else {
      storage.remove(STORAGE_KEYS.CURRENT_USER);
      storage.remove(STORAGE_KEYS.RESUME_TOKEN);
    }
  }, [user]);

  const login = useCallback(
    async (userData: Omit<User, 'id' | 'resumeToken' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);

      try {
        const resumeToken = generateResumeToken();
        const now = new Date().toISOString();

        const newUser: User = {
          id: crypto.randomUUID(),
          ...userData,
          resumeToken,
          createdAt: now,
          updatedAt: now,
        };

        // Try to save to Supabase
        try {
          await db.createUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            resume_token: newUser.resumeToken,
            created_at: newUser.createdAt,
            updated_at: newUser.updatedAt,
          });
        } catch (error) {
          console.warn('Failed to save user to Supabase, will retry later:', error);
          // Continue with local storage even if Supabase fails
        }

        setUser(newUser);
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const resumeSession = useCallback(async (token: string): Promise<boolean> => {
    if (!validateResumeToken(token)) {
      return false;
    }

    setIsLoading(true);

    try {
      // Try to fetch from Supabase first
      const { data, error } = await db.getUserByResumeToken(token);

      if (data && !error) {
        const userData = data as any;
        const resumedUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          resumeToken: userData.resume_token,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        };

        setUser(resumedUser);
        return true;
      }

      // Fallback to localStorage
      const savedUser = storage.get<User>(STORAGE_KEYS.CURRENT_USER);
      if (savedUser && savedUser.resumeToken === token) {
        setUser(savedUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error resuming session:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return;

      const updatedUser: User = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Try to update in Supabase
      try {
        await db.updateUser(user.id, {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          updated_at: updatedUser.updatedAt,
        });
      } catch (error) {
        console.warn('Failed to update user in Supabase:', error);
      }

      setUser(updatedUser);
    },
    [user]
  );

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    resumeSession,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
