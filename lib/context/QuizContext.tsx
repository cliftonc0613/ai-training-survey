'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Quiz, QuizSession, QuestionResponse } from '../types';
import { localStorage as storage, STORAGE_KEYS, indexedDB, STORE_NAMES } from '../utils/storage';
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
  loadSavedProgress: (savedData: any) => void;
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
  const [quizResponseId, setQuizResponseId] = useState<string | null>(null);
  const [lastSyncedProgress, setLastSyncedProgress] = useState<number>(0);

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

  const startQuiz = useCallback(async (quiz: Quiz) => {
    setSession({
      user,
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      responses: [],
      progress: 0,
      isComplete: false,
    });

    // Create initial quiz response record in database
    if (user && quiz) {
      try {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizId: quiz.id,
            userId: user.id,
            responses: [],
            progress: 0,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setQuizResponseId(data.quizResponse.id);
          setLastSyncedProgress(0);
          console.log('Initial quiz response created:', data.quizResponse.id);
        }
      } catch (error) {
        console.warn('Failed to create initial quiz response, will retry on next save:', error);
      }
    }
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
      const now = new Date().toISOString();

      if (quizResponseId) {
        // Update existing quiz response to mark as complete
        const response = await fetch('/api/quiz', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: quizResponseId,
            responses: session.responses,
            progress: 100,
            completedAt: now,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update quiz response');
        }

        console.log('Quiz submitted successfully:', quizResponseId);
      } else {
        // Fallback: create new quiz response if we somehow don't have an ID
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizId: session.currentQuiz.id,
            userId: user.id,
            responses: session.responses,
            progress: 100,
            completedAt: now,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create quiz response');
        }

        const data = await response.json();
        console.log('Quiz submitted successfully:', data.quizResponse.id);
      }

      // Save to IndexedDB as backup
      const quizResponse = {
        id: quizResponseId || crypto.randomUUID(),
        quiz_id: session.currentQuiz.id,
        user_id: user.id,
        responses: session.responses,
        started_at: now,
        completed_at: now,
        progress: 100,
        synced: true,
        created_at: now,
        updated_at: now,
      };
      await indexedDB.set(STORE_NAMES.QUIZ_RESPONSES, quizResponse);

      setSession((prev) => ({ ...prev, isComplete: true }));
      storage.remove(STORAGE_KEYS.QUIZ_SESSION);
      setQuizResponseId(null);
      setLastSyncedProgress(0);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session, user, quizResponseId]);

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
    setQuizResponseId(null);
    setLastSyncedProgress(0);
  }, [user]);

  const saveProgress = useCallback(async () => {
    try {
      // Always save to localStorage first
      storage.set(STORAGE_KEYS.QUIZ_SESSION, session);

      // Sync to database if we have a user, quiz, and responses
      if (user && session.currentQuiz && session.responses.length > 0) {
        // Only sync if progress has changed significantly (every 10%) or if we don't have a response ID yet
        const shouldSync = !quizResponseId || (session.progress - lastSyncedProgress >= 10);

        if (shouldSync) {
          try {
            if (quizResponseId) {
              // Update existing quiz response
              const response = await fetch('/api/quiz', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: quizResponseId,
                  responses: session.responses,
                  progress: session.progress,
                }),
              });

              if (response.ok) {
                setLastSyncedProgress(session.progress);
                console.log('Progress synced to database:', session.progress + '%');
              }
            } else {
              // Create new quiz response if we don't have an ID yet
              const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  quizId: session.currentQuiz.id,
                  userId: user.id,
                  responses: session.responses,
                  progress: session.progress,
                }),
              });

              if (response.ok) {
                const data = await response.json();
                setQuizResponseId(data.quizResponse.id);
                setLastSyncedProgress(session.progress);
                console.log('Quiz response created and synced:', data.quizResponse.id);
              }
            }
          } catch (error) {
            console.warn('Failed to sync progress to database, will retry later:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error saving quiz progress:', error);
    }
  }, [session, user, quizResponseId, lastSyncedProgress]);

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

  const loadSavedProgress = useCallback((savedData: any) => {
    try {
      // Convert saved quiz response data to QuizSession format
      const responses: QuestionResponse[] = Object.entries(savedData.answers || {}).map(
        ([questionId, answer]) => ({
          questionId,
          answer: answer as string | string[] | number | boolean,
          answeredAt: new Date().toISOString(),
        })
      );

      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: savedData.current_question_index || 0,
        responses,
        progress: responses.length,
        isComplete: false,
      }));
    } catch (error) {
      console.error('Error loading saved progress:', error);
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
    loadSavedProgress,
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
