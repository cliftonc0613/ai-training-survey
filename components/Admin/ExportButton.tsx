'use client';

import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

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

export default function ExportButton({ responses }: ExportButtonProps) {
  const handleExport = () => {
    // Convert responses to CSV
    const headers = ['Name', 'Email', 'Quiz', 'Progress', 'Started', 'Completed'];
    const csvContent = [
      headers.join(','),
      ...responses.map((r) =>
        [
          r.user?.name || 'N/A',
          r.user?.email || 'N/A',
          r.quizId,
          r.progress,
          r.createdAt,
          r.completedAt || 'N/A',
        ].join(',')
      ),
    ].join('\n');

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
  };

  return (
    <Button leftSection={<IconDownload size={16} />} onClick={handleExport} variant="light">
      Export CSV
    </Button>
  );
}
