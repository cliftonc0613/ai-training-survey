import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import QuizCard from '@/components/QuizCard';
import type { Quiz } from '@/lib/types';

// Mock quiz data
const mockQuiz: Quiz = {
  id: 'test-quiz',
  title: 'Test Survey',
  description: 'This is a test survey description for testing purposes.',
  estimatedTime: 15,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Sample question?',
      required: true,
      options: ['Option 1', 'Option 2'],
    },
    {
      id: 'q2',
      type: 'text',
      question: 'Another question?',
      required: false,
    },
  ],
};

// Helper function to render with MantineProvider
const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('QuizCard', () => {
  it('should render quiz title', () => {
    const mockOnClick = jest.fn();
    renderWithMantine(<QuizCard quiz={mockQuiz} onClick={mockOnClick} />);

    expect(screen.getByText('Test Survey')).toBeInTheDocument();
  });

  it('should render quiz description', () => {
    const mockOnClick = jest.fn();
    renderWithMantine(<QuizCard quiz={mockQuiz} onClick={mockOnClick} />);

    expect(screen.getByText(/This is a test survey description/)).toBeInTheDocument();
  });

  it('should display correct number of questions', () => {
    const mockOnClick = jest.fn();
    renderWithMantine(<QuizCard quiz={mockQuiz} onClick={mockOnClick} />);

    expect(screen.getByText('2 questions')).toBeInTheDocument();
  });

  it('should display estimated time', () => {
    const mockOnClick = jest.fn();
    renderWithMantine(<QuizCard quiz={mockQuiz} onClick={mockOnClick} />);

    expect(screen.getByText('~15 min')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    renderWithMantine(<QuizCard quiz={mockQuiz} onClick={mockOnClick} />);

    const card = screen.getByTestId('quiz-card');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should render Start button', () => {
    const mockOnClick = jest.fn();
    renderWithMantine(<QuizCard quiz={mockQuiz} onClick={mockOnClick} />);

    expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument();
  });

  it('should handle quiz with single question correctly', () => {
    const mockOnClick = jest.fn();
    const singleQuestionQuiz: Quiz = {
      ...mockQuiz,
      questions: [mockQuiz.questions[0]],
    };

    renderWithMantine(<QuizCard quiz={singleQuestionQuiz} onClick={mockOnClick} />);

    expect(screen.getByText('1 questions')).toBeInTheDocument();
  });

  it('should handle long descriptions with lineClamp', () => {
    const mockOnClick = jest.fn();
    const longDescQuiz: Quiz = {
      ...mockQuiz,
      description: 'This is a very long description that should be clamped after three lines. '.repeat(10),
    };

    renderWithMantine(<QuizCard quiz={longDescQuiz} onClick={mockOnClick} />);

    const description = screen.getByText(/This is a very long description/);
    expect(description).toBeInTheDocument();
  });

  it('should have hover interactions', () => {
    const mockOnClick = jest.fn();
    renderWithMantine(<QuizCard quiz={mockQuiz} onClick={mockOnClick} />);

    const card = screen.getByTestId('quiz-card');

    // Test mouse enter
    fireEvent.mouseEnter(card);
    expect(card.style.transform).toBe('translateY(-4px)');

    // Test mouse leave
    fireEvent.mouseLeave(card);
    expect(card.style.transform).toBe('translateY(0)');
  });
});
