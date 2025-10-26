import type { Quiz, Question } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates quiz structure and data
 */
export function validateQuiz(quiz: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required top-level fields
  if (!quiz.id || typeof quiz.id !== 'string') {
    errors.push('Quiz must have a valid id');
  }
  if (!quiz.title || typeof quiz.title !== 'string') {
    errors.push('Quiz must have a valid title');
  }
  if (!quiz.description || typeof quiz.description !== 'string') {
    errors.push('Quiz must have a valid description');
  }
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    errors.push('Quiz must have at least one question');
  }

  // Validate estimatedTime
  if (typeof quiz.estimatedTime !== 'number' || quiz.estimatedTime <= 0) {
    warnings.push('Quiz should have a positive estimatedTime in minutes');
  }

  // Validate each question
  if (Array.isArray(quiz.questions)) {
    quiz.questions.forEach((question: any, index: number) => {
      const questionErrors = validateQuestion(question, index);
      errors.push(...questionErrors);
    });
  }

  // Check for duplicate question IDs
  if (Array.isArray(quiz.questions)) {
    const ids = quiz.questions.map((q: any) => q.id);
    const duplicates = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate question IDs found: ${duplicates.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a single question
 */
export function validateQuestion(question: any, index: number): string[] {
  const errors: string[] = [];
  const prefix = `Question ${index + 1}`;

  // Check required fields
  if (!question.id || typeof question.id !== 'string') {
    errors.push(`${prefix}: Must have a valid id`);
  }
  if (!question.type || typeof question.type !== 'string') {
    errors.push(`${prefix}: Must have a valid type`);
  }
  if (!question.question || typeof question.question !== 'string') {
    errors.push(`${prefix}: Must have a valid question text`);
  }
  if (typeof question.required !== 'boolean') {
    errors.push(`${prefix}: Must have a required boolean field`);
  }

  // Type-specific validation
  const type = question.type;

  // Multiple choice and dropdown need options
  if (['multiple-choice', 'multiple-choice-cards', 'dropdown', 'checkbox'].includes(type)) {
    if (!Array.isArray(question.options) || question.options.length < 2) {
      errors.push(`${prefix}: ${type} must have at least 2 options`);
    }
  }

  // Rating questions need min/max
  if (['rating', 'rating-numbers', 'rating-slider'].includes(type)) {
    if (typeof question.minRating !== 'number') {
      errors.push(`${prefix}: ${type} must have minRating`);
    }
    if (typeof question.maxRating !== 'number') {
      errors.push(`${prefix}: ${type} must have maxRating`);
    }
    if (question.minRating >= question.maxRating) {
      errors.push(`${prefix}: minRating must be less than maxRating`);
    }
  }

  // Slider questions need min/max values
  if (type === 'slider') {
    if (typeof question.minValue !== 'number') {
      errors.push(`${prefix}: slider must have minValue`);
    }
    if (typeof question.maxValue !== 'number') {
      errors.push(`${prefix}: slider must have maxValue`);
    }
    if (question.minValue >= question.maxValue) {
      errors.push(`${prefix}: minValue must be less than maxValue`);
    }
  }

  // Checkbox selection limits
  if (type === 'checkbox') {
    if (question.minSelection && typeof question.minSelection !== 'number') {
      errors.push(`${prefix}: minSelection must be a number`);
    }
    if (question.maxSelection && typeof question.maxSelection !== 'number') {
      errors.push(`${prefix}: maxSelection must be a number`);
    }
    if (
      question.minSelection &&
      question.maxSelection &&
      question.minSelection > question.maxSelection
    ) {
      errors.push(`${prefix}: minSelection cannot be greater than maxSelection`);
    }
  }

  return errors;
}

/**
 * Loads and validates a quiz from JSON file path
 */
export async function loadQuizFromFile(filePath: string): Promise<Quiz> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load quiz from ${filePath}`);
    }

    const quiz = await response.json();
    const validation = validateQuiz(quiz);

    if (!validation.isValid) {
      throw new Error(`Quiz validation failed: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Quiz validation warnings:', validation.warnings);
    }

    return quiz as Quiz;
  } catch (error) {
    console.error('Error loading quiz:', error);
    throw error;
  }
}

/**
 * Loads all quizzes from the data/quizzes directory
 */
export async function loadAllQuizzes(): Promise<Quiz[]> {
  const quizFiles = [
    '/data/quizzes/survey-30days.json',
    '/data/quizzes/survey-90days.json',
    '/data/quizzes/survey-180days.json',
    '/data/quizzes/survey-12months-final.json',
  ];

  const quizzes: Quiz[] = [];

  for (const file of quizFiles) {
    try {
      const quiz = await loadQuizFromFile(file);
      quizzes.push(quiz);
    } catch (error) {
      console.error(`Failed to load quiz from ${file}:`, error);
    }
  }

  return quizzes;
}
