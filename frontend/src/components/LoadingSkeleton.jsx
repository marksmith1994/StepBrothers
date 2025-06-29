import React from 'react';
import { Skeleton, Box, Card, CardContent, Grid, Paper } from '@mui/material';

// Card skeleton for stat cards
export const CardSkeleton = ({ height = 120, width = '100%' }) => (
  <Card sx={{ height, width }}>
    <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto' }} />
    </CardContent>
  </Card>
);

// Chart skeleton
export const ChartSkeleton = ({ height = 300, width = '100%' }) => (
  <Paper sx={{ p: 3, height, width }}>
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={height - 80} sx={{ borderRadius: 2 }} />
  </Paper>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Paper sx={{ p: 3 }}>
    <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="text" 
              width={`${100 / columns}%`} 
              height={40} 
            />
          ))}
        </Box>
      ))}
    </Box>
  </Paper>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <Box sx={{ p: { xs: 2, sm: 4 } }}>
    {/* Header skeleton */}
    <Skeleton variant="text" width="60%" height={48} sx={{ mb: 3 }} />
    
    {/* Quick stats skeleton */}
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
    
    {/* Month selector skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" width="200px" height={56} sx={{ borderRadius: 1 }} />
    </Box>
    
    {/* Charts skeleton */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <ChartSkeleton height={300} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ChartSkeleton height={300} />
      </Grid>
    </Grid>
    
    {/* Table skeleton */}
    <TableSkeleton rows={8} columns={5} />
  </Box>
);

// Person page skeleton
export const PersonPageSkeleton = () => (
  <Box sx={{ p: { xs: 2, sm: 4 } }}>
    {/* Back button skeleton */}
    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2, mb: 3 }} />
    
    {/* Profile header skeleton */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Box>
          <Skeleton variant="text" width={200} height={48} />
          <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 4 }} />
        </Box>
      </Box>
    </Box>
    
    {/* Stats cards skeleton */}
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <CardSkeleton height={100} />
        </Grid>
      ))}
    </Grid>
    
    {/* Tabs skeleton */}
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    </Box>
    
    {/* Content skeleton */}
    <ChartSkeleton height={400} />
  </Box>
);

// Gamification page skeleton
export const GamificationPageSkeleton = () => (
  <Box sx={{ p: { xs: 2, sm: 4 } }}>
    {/* Header skeleton */}
    <Skeleton variant="text" width="50%" height={48} sx={{ mb: 3 }} />
    
    {/* Tabs skeleton */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    </Box>
    
    {/* Content grid skeleton */}
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <ChartSkeleton height={400} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} height={80} />
          ))}
        </Box>
      </Grid>
    </Grid>
  </Box>
);

// Generic loading spinner
export const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: '200px',
    gap: 2
  }}>
    <Skeleton variant="circular" width={size} height={size} />
    {message && (
      <Skeleton variant="text" width={120} height={24} />
    )}
  </Box>
);

export default {
  CardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  PersonPageSkeleton,
  GamificationPageSkeleton,
  LoadingSpinner
};
