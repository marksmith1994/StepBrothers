import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Typography } from '@mui/material';

export default function StepLineChart({ data, title }) {
  if (!data || data.length === 0) return null;
  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        {title || 'Steps per Month'}
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="steps" name="Steps" stroke="#8884d8" strokeWidth={2} />
          {data[0]?.total !== undefined && (
            <Line type="monotone" dataKey="total" name="Total (All)" stroke="#82ca9d" strokeWidth={2} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
