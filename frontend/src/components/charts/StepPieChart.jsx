import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF4444'
];

function renderCustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, entry) => sum + entry.value, 0);
  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="subtitle2">{label}</Typography>
      {payload.map((entry, idx) => {
        const percent = total ? ((entry.value / total) * 100).toFixed(1) : 0;
        return (
          <Typography key={idx} variant="body2" color="textSecondary">
            {entry.name}: {entry.value.toLocaleString()} steps ({percent}%)
          </Typography>
        );
      })}
    </Paper>
  );
}

export default function StepPieChart({ data, loading, error, title }) {
  if (loading) return null;
  if (error) return null;
  if (!data || data.length === 0) return null;

  return (
    <Paper sx={{ mb: 4, p: 2 }} aria-label="Pie chart showing total steps by person">
      <Typography variant="h6" align="center" gutterBottom>
        {title || 'Total Steps by Person'}
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart aria-label="Total steps pie chart">
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            label
            aria-label="Pie slices for each person"
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
