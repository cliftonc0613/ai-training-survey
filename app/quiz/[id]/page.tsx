'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Button,
  Progress,
  Radio,
  Textarea,
  Rating,
  Loader,
  Alert,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { useQuiz } from '@/lib/context/QuizContext';
import { useQuizProgress } from '@/lib/hooks/useQuizProgress';
import type { Quiz, Question } from '@/lib/types';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const { user, isLoading: userLoading } = useUser();
  const { session, startQuiz, answerQuestion, nextQuestion, previousQuestion, submitQuiz } =
    useQuiz();
  const {
    totalQuestions,
    currentQuestionNumber,
    progressPercentage,
    isFirstQuestion,
    isLastQuestion,
    getAnswerForQuestion,
    hasAnsweredAll,
  } = useQuizProgress();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/start');
      return;
    }

    if (user && quizId) {
      fetchQuiz(quizId);
    }
  }, [user, userLoading, quizId, router]);

  const fetchQuiz = async (id: string) => {
    try {
      const response = await fetch(`/api/quiz/${id}`);
      if (!response.ok) throw new Error('Failed to fetch quiz');

      const data = await response.json();
      setQuiz(data.quiz);
      startQuiz(data.quiz);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    answerQuestion(questionId, answer);
  };

  const handleSubmit = async () => {
    if (!hasAnsweredAll()) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitQuiz();
      router.push('/thank-you');
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Your progress has been saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <Container size="md" py={60}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading quiz...</Text>
        </Stack>
      </Container>
    );
  }

  if (!quiz || !session.currentQuiz) {
    return (
      <Container size="md" py={60}>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          Quiz not found.
        </Alert>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[session.currentQuestionIndex];
  const currentAnswer = getAnswerForQuestion(currentQuestion.id);

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <Radio.Group
            value={currentAnswer as string}
            onChange={(value) => handleAnswer(question.id, value)}
          >
            <Stack gap="sm">
              {question.options?.map((option) => (
                <Radio key={option} value={option} label={option} size="md" />
              ))}
            </Stack>
          </Radio.Group>
        );

      case 'text':
        return (
          <Textarea
            placeholder={question.placeholder || 'Enter your answer...'}
            value={(currentAnswer as string) || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            minRows={4}
            autosize
          />
        );

      case 'rating':
        return (
          <Stack gap="md" align="center">
            <Rating
              value={(currentAnswer as number) || 0}
              onChange={(value) => handleAnswer(question.id, value)}
              size="xl"
              count={question.maxRating || 5}
            />
            <Text size="sm" c="dimmed">
              {currentAnswer ? `${currentAnswer} / ${question.maxRating || 5}` : 'Select a rating'}
            </Text>
          </Stack>
        );

      case 'yes-no':
        return (
          <Radio.Group
            value={currentAnswer as string}
            onChange={(value) => handleAnswer(question.id, value === 'yes')}
          >
            <Stack gap="sm">
              <Radio value="yes" label="Yes" size="md" />
              <Radio value="no" label="No" size="md" />
            </Stack>
          </Radio.Group>
        );

      default:
        return <Text c="dimmed">Unsupported question type</Text>;
    }
  };

  return (
    <Container size="md" py={60}>
      <Stack gap="xl">
        {/* Progress Bar */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              Question {currentQuestionNumber} of {totalQuestions}
            </Text>
            <Text size="sm" c="dimmed">
              {progressPercentage}% Complete
            </Text>
          </Group>
          <Progress value={progressPercentage} size="lg" radius="xl" />
        </div>

        {/* Quiz Title */}
        <div>
          <Title order={2} size="h3">
            {quiz.title}
          </Title>
          <Text c="dimmed" size="sm">
            {quiz.description}
          </Text>
        </div>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            onClose={() => setError(null)}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {/* Question */}
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Stack gap="xl">
            <div>
              <Text size="lg" fw={600} mb="md">
                {currentQuestion.question}
                {currentQuestion.required && (
                  <Text component="span" c="red" ml={4}>
                    *
                  </Text>
                )}
              </Text>
              {renderQuestion(currentQuestion)}
            </div>

            {/* Navigation */}
            <Group justify="space-between" mt="lg">
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                onClick={previousQuestion}
                disabled={isFirstQuestion}
              >
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  size="md"
                  leftSection={<IconCheck size={16} />}
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={!currentAnswer}
                >
                  Submit Survey
                </Button>
              ) : (
                <Button
                  size="md"
                  rightSection={<IconArrowRight size={16} />}
                  onClick={nextQuestion}
                  disabled={!currentAnswer}
                >
                  Next Question
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>

        {/* Footer Info */}
        <Paper p="md" radius="md" bg="gray.0" withBorder>
          <Text size="xs" c="dimmed">
            Your progress is saved automatically. You can resume anytime using your token:{' '}
            <Text component="span" fw={600}>
              {user?.resumeToken}
            </Text>
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
