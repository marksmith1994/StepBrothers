import { Box, Skeleton, Paper } from '@mui/material';

export default function DashboardSkeleton() {
  return (
    <Box sx={{ width: '100%', background: '#fff', p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Skeleton variant="text" width={220} height={50} sx={{ mb: 2 }} />
      <Paper sx={{ mb: 4, p: 2 }}>
        <Skeleton variant="circular" width={320} height={320} sx={{ mx: 'auto', mb: 2 }} />
      </Paper>
      <Skeleton variant="rectangular" width="100%" height={400} />
    </Box>
  );
}
