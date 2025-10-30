import { useCallback, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';

interface QuizProgressMetrics {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  progressPercentage: number;
  currentQuestionNumber: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isComplete: boolean;
  estimatedTimeRemaining: number; // in minutes
}

interface UseQuizProgressReturn extends QuizProgressMetrics {
  getAnswerForQuestion: (questionId: string) => string | string[] | number | boolean | undefined;
  isQuestionAnswered: (questionId: string) => boolean;
  getUnansweredQuestions: () => string[];
  hasAnsweredAll: () => boolean;
}

export function useQuizProgress(): UseQuizProgressReturn {
  const { session } = useQuiz();

  const totalQuestions = useMemo(() => {
    return session.currentQuiz?.questions.length || 0;
  }, [session.currentQuiz]);

  const answeredQuestions = useMemo(() => {
    return session.responses.length;
  }, [session.responses]);

  const unansweredQuestions = useMemo(() => {
    return totalQuestions - answeredQuestions;
  }, [totalQuestions, answeredQuestions]);

  const progressPercentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }, [answeredQuestions, totalQuestions]);

  const currentQuestionNumber = useMemo(() => {
    return session.currentQuestionIndex + 1;
  }, [session.currentQuestionIndex]);

  const isFirstQuestion = useMemo(() => {
    return session.currentQuestionIndex === 0;
  }, [session.currentQuestionIndex]);

  const isLastQuestion = useMemo(() => {
    return session.currentQuestionIndex === totalQuestions - 1;
  }, [session.currentQuestionIndex, totalQuestions]);

  const canGoBack = useMemo(() => {
    return !isFirstQuestion;
  }, [isFirstQuestion]);

  const canGoForward = useMemo(() => {
    return !isLastQuestion;
  }, [isLastQuestion]);

  const isComplete = useMemo(() => {
    return session.isComplete || (answeredQuestions === totalQuestions && totalQuestions > 0);
  }, [session.isComplete, answeredQuestions, totalQuestions]);

  const estimatedTimeRemaining = useMemo(() => {
    if (!session.currentQuiz || totalQuestions === 0) return 0;

    const totalEstimatedTime = session.currentQuiz.estimatedTime;
    const timePerQuestion = totalEstimatedTime / totalQuestions;
    const remainingQuestions = unansweredQuestions;

    return Math.ceil(remainingQuestions * timePerQuestion);
  }, [session.currentQuiz, totalQuestions, unansweredQuestions]);

  const getAnswerForQuestion = useCallback(
    (questionId: string) => {
      const response = session.responses.find((r) => r.questionId === questionId);
      return response?.answer;
    },
    [session.responses]
  );

  const isQuestionAnswered = useCallback(
    (questionId: string) => {
      return session.responses.some((r) => r.questionId === questionId);
    },
    [session.responses]
  );

  const getUnansweredQuestions = useCallback(() => {
    if (!session.currentQuiz) return [];

    const answeredIds = new Set(session.responses.map((r) => r.questionId));
    return session.currentQuiz.questions
      .filter((q) => !answeredIds.has(q.id))
      .map((q) => q.id);
  }, [session.currentQuiz, session.responses]);

  const hasAnsweredAll = useCallback(() => {
    if (!session.currentQuiz) return false;
    return answeredQuestions === totalQuestions && totalQuestions > 0;
  }, [answeredQuestions, totalQuestions, session.currentQuiz]);

  return {
    totalQuestions,
    answeredQuestions,
    unansweredQuestions,
    progressPercentage,
    currentQuestionNumber,
    isFirstQuestion,
    isLastQuestion,
    canGoBack,
    canGoForward,
    isComplete,
    estimatedTimeRemaining,
    getAnswerForQuestion,
    isQuestionAnswered,
    getUnansweredQuestions,
    hasAnsweredAll,
  };
}
