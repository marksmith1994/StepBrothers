import React from "react";
import { useParams } from 'react-router-dom';
import { Box, Typography, Alert, Button } from '@mui/material';
import StepLineChart from './charts/StepLineChart';
import StepBarChart from './charts/StepBarChart';
import { useStepsData } from '../hooks/useStepsData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import PersonPageSkeleton from './skeletons/PersonPageSkeleton';

export default function PersonPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { data: steps, loading, error } = useStepsData({ person: name });

  // Set page title on mount
  React.useEffect(() => {
    document.title = `Step Brother - ${name}`;
    return () => {
      document.title = 'Step Brothers Dashboard';
    };
  }, [name]);

  // Prepare chart data
  const chartData = steps.map(entry => ({
    month: entry.month,
    steps: entry.steps[name],
    total: entry.total
  }));

  return (
    <Box sx={{ width: '100%', background: '#fff', p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} onClick={() => navigate('/')}>Back to Dashboard</Button>
      <Typography variant="h4" gutterBottom align="center">
        Step Brother - {name}
      </Typography>
      {loading && <PersonPageSkeleton />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          <StepLineChart data={chartData} />
          <StepBarChart data={chartData} />
        </>
      )}
    </Box>
  );
}
