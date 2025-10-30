'use client';

import { Paper, Title } from '@mantine/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
  title: string;
}

export default function AnalyticsChart({ data, title }: AnalyticsChartProps) {
  // Format date for display
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    responses: item.count,
  }));

  return (
    <Paper shadow="sm" p="xl" radius="md" withBorder>
      <Title order={3} mb="lg">
        {title}
      </Title>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            style={{ fontSize: '12px' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="responses"
            stroke="#339af0"
            strokeWidth={2}
            dot={{ fill: '#339af0', r: 4 }}
            activeDot={{ r: 6 }}
            name="Survey Responses"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
