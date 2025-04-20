import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import Leaderboard from '../components/Leaderboard';
import StepPieChart from '../components/StepPieChart';
import { useStepsData } from '../hooks/useStepsData';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import PersonPage from './PersonPage';

export default function Home() {
  const [tab, setTab] = React.useState('dashboard');
  const { data: totals, loading, error } = useStepsData({ totals: true });
  const pieData = totals && typeof totals === 'object'
    ? Object.entries(totals).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto', p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 900 }}>StepBrothers Leaderboard</Typography>
      <Routes>
        <Route path="/" element={<>
          <Dashboard tab={tab} setTab={setTab} />
          <Leaderboard tab={tab} setTab={setTab} />
        </>} />
        <Route path="/person/:name" element={<PersonPage tab={tab} setTab={setTab} />} />
      </Routes>
      <Box sx={{ mt: 4 }}>
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && pieData.length === 0 && (
          <Alert severity="info">No step data available yet.</Alert>
        )}
        {!loading && !error && pieData.length > 0 && (
          <StepPieChart data={pieData} loading={loading} error={error} />
        )}
      </Box>
    </Box>
  );
}
