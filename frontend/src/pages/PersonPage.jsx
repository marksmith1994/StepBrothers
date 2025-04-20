import React from "react";
import { useParams } from 'react-router-dom';
import { Box, Typography, Alert, Button } from '@mui/material';
import StepLineChart from '../components/StepLineChart';
// import StepBarChart from './charts/StepBarChart'; // File does not exist, comment out or remove
import { useStepsData } from '../hooks/useStepsData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import PersonPageSkeleton from '../components/PersonPageSkeleton';

export default function PersonPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  // Fetch all data (no tab), filter for person
  const { data: allData, loading, error } = useStepsData();
  // Lowercase name for matching keys
  const personKey = name.toLowerCase();
  // Filter allData for entries that have this person as a key
  const personData = React.useMemo(() =>
    allData.filter(entry => Object.keys(entry).includes(personKey)),
    [allData, personKey]
  );

  // Set page title on mount
  React.useEffect(() => {
    document.title = `Step Brother - ${name}`;
    return () => {
      document.title = 'Step Brothers Dashboard';
    };
  }, [name]);

  // Prepare chart data
  const chartData = personData.map(entry => ({
    month: entry.month,
    steps: entry[personKey],
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
        </>
      )}
    </Box>
  );
}
