'use client';

import { useState } from 'react';
import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface QuizResponse {
  id: string;
  quizId: string;
  userId: string;
  progress: number;
  completedAt: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ExportButtonProps {
  responses: QuizResponse[];
}

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
}

interface Answer {
  questionId: string;
  answer: string | string[] | number;
}

interface DetailedResponse {
  id: string;
  quizId: string;
  userId: string;
  progress: number;
  responses: Answer[];
  startedAt: string;
  completedAt: string | null;
  user?: {
    name: string;
    email: string;
  };
  quiz?: {
    title: string;
    description: string;
    questions: Question[];
  };
}

export default function ExportButton({ responses }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Fetch detailed responses with answers
      const detailedResponses: DetailedResponse[] = await Promise.all(
        responses.map(async (response) => {
          const res = await fetch(`/api/admin/responses/${response.id}`);
          if (!res.ok) throw new Error(`Failed to fetch response ${response.id}`);
          return res.json();
        })
      );

      // Build CSV with dynamic columns based on quiz questions
      const allQuestions = new Map<string, string>();

      // Collect all unique questions across all responses
      detailedResponses.forEach((response) => {
        response.quiz?.questions.forEach((q) => {
          allQuestions.set(q.id, q.question);
        });
      });

      // Create headers
      const staticHeaders = ['Name', 'Email', 'Quiz', 'Progress', 'Started', 'Completed'];
      const questionHeaders = Array.from(allQuestions.values());
      const headers = [...staticHeaders, ...questionHeaders];

      // Create rows
      const rows = detailedResponses.map((response) => {
        const staticData = [
          escapeCSV(response.user?.name || 'N/A'),
          escapeCSV(response.user?.email || 'N/A'),
          escapeCSV(response.quiz?.title || response.quizId),
          response.progress,
          response.startedAt,
          response.completedAt || 'N/A',
        ];

        // Map answers to their questions
        const answerMap = new Map<string, string>();
        response.responses.forEach((r) => {
          const answer = Array.isArray(r.answer) ? r.answer.join('; ') : String(r.answer);
          answerMap.set(r.questionId, answer);
        });

        // Add answers in the same order as question headers
        const answerData = Array.from(allQuestions.keys()).map((questionId) => {
          const answer = answerMap.get(questionId) || 'N/A';
          return escapeCSV(answer);
        });

        return [...staticData, ...answerData].join(',');
      });

      const csvContent = [headers.map(escapeCSV).join(','), ...rows].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `survey-responses-${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notifications.show({
        title: 'Export Successful',
        message: `Exported ${responses.length} responses with answers`,
        color: 'teal',
      });
    } catch (error) {
      console.error('Export error:', error);
      notifications.show({
        title: 'Export Failed',
        message: 'Failed to export responses. Please try again.',
        color: 'red',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const escapeCSV = (value: string | number): string => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  return (
    <Button
      leftSection={<IconDownload size={16} />}
      onClick={handleExport}
      variant="light"
      loading={isExporting}
      disabled={isExporting || responses.length === 0}
    >
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  );
}
