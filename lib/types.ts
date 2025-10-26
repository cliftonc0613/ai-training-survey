// Core type definitions for the AI Training Survey PWA

export type QuestionType = 'multiple-choice' | 'text' | 'rating' | 'yes-no';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice questions
  required: boolean;
  placeholder?: string; // For text questions
  minRating?: number; // For rating questions
  maxRating?: number; // For rating questions
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  estimatedTime: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  questionId: string;
  answer: string | string[] | number | boolean;
  answeredAt: string;
}

export interface QuizResponse {
  id: string;
  quizId: string;
  userId: string;
  responses: QuestionResponse[];
  startedAt: string;
  completedAt?: string;
  progress: number; // 0-100
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSession {
  user: User | null;
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  responses: QuestionResponse[];
  progress: number;
  isComplete: boolean;
}

export interface OfflineQueueItem {
  id: string;
  type: 'user' | 'response';
  data: User | QuizResponse;
  timestamp: string;
  retryCount: number;
  synced: boolean;
}
