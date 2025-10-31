'use client';

import { Paper, Title, useMantineTheme, useMantineColorScheme } from '@mantine/core';
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
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

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
      {formattedData.length === 0 ? (
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p
            style={{
              color: colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[6],
              fontSize: '14px',
            }}
          >
            No response data available yet
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={formattedData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}
            />
            <XAxis
              dataKey="date"
              style={{ fontSize: '12px' }}
              stroke={colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[6]}
            />
            <YAxis
              style={{ fontSize: '12px' }}
              allowDecimals={false}
              stroke={colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[6]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : '#fff',
                border:
                  colorScheme === 'dark'
                    ? `1px solid ${theme.colors.dark[4]}`
                    : '1px solid #e9ecef',
                borderRadius: '8px',
                color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="responses"
              stroke={colorScheme === 'dark' ? theme.colors.blue[5] : theme.colors.blue[6]}
              strokeWidth={2}
              dot={{
                fill: colorScheme === 'dark' ? theme.colors.blue[5] : theme.colors.blue[6],
                r: 4,
              }}
              activeDot={{ r: 6 }}
              name="Survey Responses"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
