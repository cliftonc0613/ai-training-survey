'use client';

import { useState } from 'react';
import { Paper, Group, Select, Button } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconFilter, IconFilterOff } from '@tabler/icons-react';

interface ResponseFiltersProps {
  onFilterChange: (filters: {
    quizId?: string;
    dateRange?: [Date | null, Date | null];
    status?: string;
  }) => void;
}

export default function ResponseFilters({ onFilterChange }: ResponseFiltersProps) {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const handleApplyFilters = () => {
    onFilterChange({
      quizId: quizId || undefined,
      status: status || undefined,
      dateRange: dateRange[0] && dateRange[1] ? dateRange : undefined,
    });
  };

  const handleClearFilters = () => {
    setQuizId(null);
    setStatus(null);
    setDateRange([null, null]);
    onFilterChange({});
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Group gap="md">
        <Select
          placeholder="Filter by quiz"
          data={[
            { value: 'survey-30days', label: '30-Day Follow-Up' },
            { value: 'survey-90days', label: '90-Day Progress Check-In' },
            { value: 'survey-180days', label: '6-Month Impact Assessment' },
            { value: 'survey-12months-final', label: '12-Month Final Assessment' },
          ]}
          value={quizId}
          onChange={setQuizId}
          clearable
          style={{ flex: 1 }}
        />

        <Select
          placeholder="Filter by status"
          data={[
            { value: 'completed', label: 'Completed' },
            { value: 'in-progress', label: 'In Progress' },
          ]}
          value={status}
          onChange={setStatus}
          clearable
          style={{ flex: 1 }}
        />

        <DatePickerInput
          type="range"
          placeholder="Pick date range"
          value={dateRange}
          onChange={(value) => setDateRange(value as [Date | null, Date | null])}
          clearable
          style={{ flex: 1 }}
        />

        <Button leftSection={<IconFilter size={16} />} onClick={handleApplyFilters}>
          Apply
        </Button>

        <Button
          variant="light"
          leftSection={<IconFilterOff size={16} />}
          onClick={handleClearFilters}
        >
          Clear
        </Button>
      </Group>
    </Paper>
  );
}
