import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert, Link, Paper } from '@mui/material';
import StepPieChart from './charts/StepPieChart';
import { DataGrid } from '@mui/x-data-grid';
import { useStepsData } from '../hooks/useStepsData';
import DashboardSkeleton from './skeletons/DashboardSkeleton';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: steps, loading, error } = useStepsData();
  const { data: totals, loading: totalsLoading, error: totalsError } = useStepsData({ totals: true });

  let columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'month', headerName: 'Month', flex: 1 },
  ];
  let rows = [];

  if (steps.length > 0) {
    const people = Object.keys(steps[0].steps);
    columns = [
      { field: 'id', headerName: 'ID', flex: 0.5 },
      { field: 'month', headerName: 'Month', flex: 1 },
      ...people.map(person => ({
        field: person,
        headerName: person,
        renderHeader: () => (
          <Link
            component="button"
            onClick={() => navigate(`/person/${encodeURIComponent(person)}`)}
            underline="hover"
          >
            {person}
          </Link>
        ),
        flex: 1,
        renderCell: (params) => {
          const row = params.row;
          const values = people.map(p => row[p]).filter(v => v !== null && v !== undefined && v !== '');
          const max = Math.max(...values);
          const isMax = row[person] === max && max !== -Infinity;
          return (
            <span style={isMax ? { fontWeight: 'bold' } : {}}>{row[person]}</span>
          );
        }
      })),
      { field: 'total', headerName: 'Total', flex: 1 },
    ];

    rows = steps.map((entry, idx) => {
      const row = {
        id: idx + 1,
        month: entry.month,
        total: entry.total,
      };
      people.forEach(person => {
        row[person] = entry.steps[person] ?? '';
      });
      return row;
    });
  }

  // Prepare pie chart data
  let pieData = [];
  if (totals && typeof totals === 'object') {
    pieData = Object.keys(totals).map((name) => ({ name, value: totals[name] }));
  }

  return (
    <Box sx={{ width: '100%', background: '#fff', p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom>
        Step Dashboard
      </Typography>
      <StepPieChart data={pieData} loading={totalsLoading} error={totalsError} />
      {loading && <DashboardSkeleton />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 16, 32]}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </Box>
  );
}
