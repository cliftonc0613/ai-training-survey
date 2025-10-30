// Core type definitions for the AI Training Survey PWA

export type QuestionType =
  | 'multiple-choice'
  | 'multiple-choice-cards'
  | 'checkbox'
  | 'rating'
  | 'rating-numbers'
  | 'rating-slider'
  | 'dropdown'
  | 'slider'
  | 'text'
  | 'text-short'
  | 'text-long'
  | 'number'
  | 'yes-no';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice, checkbox, dropdown
  required: boolean;
  placeholder?: string; // For text questions

  // Rating questions
  minRating?: number;
  maxRating?: number;
  ratingLabels?: { min?: string; max?: string };

  // Checkbox questions
  minSelection?: number;
  maxSelection?: number;

  // Slider questions
  minValue?: number;
  maxValue?: number;
  step?: number;
  marks?: Array<{ value: number; label: string }>;
  sliderLabels?: { min?: string; max?: string };
  showValue?: boolean;

  // Text questions
  minLength?: number;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;

  // Dropdown questions
  searchable?: boolean;
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
