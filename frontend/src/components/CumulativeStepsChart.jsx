import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF4444'
];

function renderCustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  
  return (
    <Paper sx={{ p: 2, border: '1px solid #ccc' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Day {label}
      </Typography>
      {payload.map((entry, idx) => (
        <Typography key={idx} variant="body2" sx={{ color: entry.color }}>
          {entry.name}: {entry.value?.toLocaleString()} steps
        </Typography>
      ))}
    </Paper>
  );
}

export default function CumulativeStepsChart({ cumulativeData, participants }) {
  if (!cumulativeData || cumulativeData.length === 0 || !participants) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No cumulative data available
        </Typography>
      </Paper>
    );
  }

  // Transform data for the chart
  const chartData = cumulativeData.map(entry => {
    const dataPoint = { day: entry.day };
    participants.forEach(participant => {
      if (entry.cumulativeSteps[participant] !== undefined) {
        dataPoint[participant] = entry.cumulativeSteps[participant];
      }
    });
    return dataPoint;
  });

  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 3, 
      boxShadow: 3,
      display: { xs: 'none', md: 'block' } // Hide on mobile, show on desktop
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TrendingUpIcon sx={{ color: '#4CAF50', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1 }}>
          Cumulative Steps Progress
        </Typography>
      </Box>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day" 
            label={{ value: 'Day', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            label={{ value: 'Cumulative Steps', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={renderCustomTooltip} />
          <Legend />
          {participants.map((participant, index) => (
            <Line
              key={participant}
              type="monotone"
              dataKey={participant}
              name={participant}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
} 