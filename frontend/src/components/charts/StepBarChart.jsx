import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Typography } from '@mui/material';

export default function StepBarChart({ data, title }) {
  if (!data || data.length === 0) return null;
  return (
    <>
      <Typography variant="h6" align="center" gutterBottom sx={{ mt: 4 }}>
        {title || 'Steps per Month (Bar)'}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="steps" name="Steps" fill="#8884d8" />
          {data[0]?.total !== undefined && (
            <Bar dataKey="total" name="Total (All)" fill="#82ca9d" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
