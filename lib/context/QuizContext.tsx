'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Quiz, QuizSession, QuestionResponse } from '../types';
import { localStorage as storage, STORAGE_KEYS, indexedDB, STORE_NAMES } from '../utils/storage';
import { db } from '../supabaseClient';
import { useUser } from './UserContext';

interface QuizContextType {
  session: QuizSession;
  isLoading: boolean;
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (questionId: string, answer: string | string[] | number | boolean) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [session, setSession] = useState<QuizSession>({
    user: null,
    currentQuiz: null,
    currentQuestionIndex: 0,
    responses: [],
    progress: 0,
    isComplete: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update session user when user context changes
  useEffect(() => {
    setSession((prev) => ({ ...prev, user }));
  }, [user]);

  // Load saved session on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Auto-save progress when responses change
  useEffect(() => {
    if (session.currentQuiz && session.responses.length > 0) {
      saveProgress();
    }
  }, [session.responses]);

  const startQuiz = useCallback((quiz: Quiz) => {
    setSession({
      user,
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      responses: [],
      progress: 0,
      isComplete: false,
    });
  }, [user]);

  const answerQuestion = useCallback(
    (questionId: string, answer: string | string[] | number | boolean) => {
      setSession((prev) => {
        // Remove existing response for this question if any
        const filteredResponses = prev.responses.filter((r) => r.questionId !== questionId);

        const newResponse: QuestionResponse = {
          questionId,
          answer,
          answeredAt: new Date().toISOString(),
        };

        const newResponses = [...filteredResponses, newResponse];
        const totalQuestions = prev.currentQuiz?.questions.length || 1;
        const progress = Math.round((newResponses.length / totalQuestions) * 100);

        return {
          ...prev,
          responses: newResponses,
          progress,
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setSession((prev) => {
      const maxIndex = (prev.currentQuiz?.questions.length || 1) - 1;
      const nextIndex = Math.min(prev.currentQuestionIndex + 1, maxIndex);
      return { ...prev, currentQuestionIndex: nextIndex };
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setSession((prev) => {
      const prevIndex = Math.max(prev.currentQuestionIndex - 1, 0);
      return { ...prev, currentQuestionIndex: prevIndex };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setSession((prev) => {
      const maxIndex = (prev.currentQuiz?.questions.length || 1) - 1;
      const safeIndex = Math.max(0, Math.min(index, maxIndex));
      return { ...prev, currentQuestionIndex: safeIndex };
    });
  }, []);

  const submitQuiz = useCallback(async () => {
    if (!session.currentQuiz || !user) {
      throw new Error('Cannot submit quiz: missing quiz or user data');
    }

    setIsLoading(true);

    try {
      const quizResponse = {
        id: crypto.randomUUID(),
        quiz_id: session.currentQuiz.id,
        user_id: user.id,
        responses: session.responses,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        progress: 100,
        synced: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to IndexedDB first
      await indexedDB.set(STORE_NAMES.QUIZ_RESPONSES, quizResponse);

      // Try to sync to Supabase
      try {
        await db.createQuizResponse(quizResponse);
        quizResponse.synced = true;
        await indexedDB.set(STORE_NAMES.QUIZ_RESPONSES, quizResponse);
      } catch (error) {
        console.warn('Failed to sync quiz response to Supabase, will retry later:', error);
      }

      setSession((prev) => ({ ...prev, isComplete: true }));
      storage.remove(STORAGE_KEYS.QUIZ_SESSION);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session, user]);

  const resetQuiz = useCallback(() => {
    setSession({
      user,
      currentQuiz: null,
      currentQuestionIndex: 0,
      responses: [],
      progress: 0,
      isComplete: false,
    });
    storage.remove(STORAGE_KEYS.QUIZ_SESSION);
  }, [user]);

  const saveProgress = useCallback(async () => {
    try {
      storage.set(STORAGE_KEYS.QUIZ_SESSION, session);
    } catch (error) {
      console.error('Error saving quiz progress:', error);
    }
  }, [session]);

  const loadProgress = useCallback(async () => {
    try {
      const savedSession = storage.get<QuizSession>(STORAGE_KEYS.QUIZ_SESSION);
      if (savedSession && savedSession.currentQuiz) {
        setSession((prev) => ({
          ...savedSession,
          user: prev.user, // Use current user from context
        }));
      }
    } catch (error) {
      console.error('Error loading quiz progress:', error);
    }
  }, []);

  const value: QuizContextType = {
    session,
    isLoading,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    saveProgress,
    loadProgress,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
