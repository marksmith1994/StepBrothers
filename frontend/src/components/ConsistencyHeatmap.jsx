import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  useTheme 
} from '@mui/material';
import { formatNumber } from '../utils/helpers';

export default function ConsistencyHeatmap({ dailySteps }) {
  const theme = useTheme();

  // Create heatmap data (last 30 days)
  const heatmapData = React.useMemo(() => {
    if (!dailySteps || dailySteps.length === 0) return [];

    const last30Days = dailySteps.slice(-30);
    const maxSteps = Math.max(...last30Days);
    
    return last30Days.map((steps, index) => ({
      day: index + 1,
      steps,
      intensity: steps > 0 ? Math.min(1, steps / maxSteps) : 0,
      category: steps >= 10000 ? 'excellent' : 
                steps >= 7500 ? 'good' : 
                steps >= 5000 ? 'moderate' : 
                steps > 0 ? 'low' : 'none'
    }));
  }, [dailySteps]);

  const getColor = (category) => {
    switch (category) {
      case 'excellent':
        return theme.palette.success.main;
      case 'good':
        return theme.palette.primary.main;
      case 'moderate':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.error.main;
      default:
        return theme.palette.divider;
    }
  };

  const getIntensity = (intensity) => {
    return Math.max(0.1, intensity);
  };

  if (heatmapData.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="text-center p-4">
          <Typography variant="h6" color="text.secondary">
            No consistency data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <Typography variant="h5" className="text-bold mb-3 text-center">
          🔥 Daily Consistency Heatmap (Last 30 Days)
        </Typography>
        
        {/* Heatmap Grid */}
        <Box className="mb-4">
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)', 
              gap: 1,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {heatmapData.map((day) => (
              <Box
                key={day.day}
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  backgroundColor: getColor(day.category),
                  opacity: getIntensity(day.intensity),
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    transform: 'scale(1.1)',
                    zIndex: 1
                  }
                }}
                title={`Day ${day.day}: ${formatNumber(day.steps)} steps`}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: day.steps > 0 ? 'white' : theme.palette.text.secondary,
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                >
                  {day.day}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Legend */}
        <Box className="text-center">
          <Typography variant="body2" className="text-bold mb-2">
            Legend
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                backgroundColor: theme.palette.success.main,
                borderRadius: 0.5
              }} />
              <Typography variant="caption">10K+</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                backgroundColor: theme.palette.primary.main,
                borderRadius: 0.5
              }} />
              <Typography variant="caption">7.5K-10K</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                backgroundColor: theme.palette.warning.main,
                borderRadius: 0.5
              }} />
              <Typography variant="caption">5K-7.5K</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                backgroundColor: theme.palette.error.main,
                borderRadius: 0.5
              }} />
              <Typography variant="caption">&lt;5K</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                backgroundColor: theme.palette.divider,
                borderRadius: 0.5
              }} />
              <Typography variant="caption">No Data</Typography>
            </Box>
          </Box>
        </Box>

        {/* Summary Stats */}
        <Box className="mt-4">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: 2 
          }}>
            <Box className="text-center p-2 rounded" sx={{ 
              backgroundColor: theme.palette.success.main + '20',
              border: `1px solid ${theme.palette.success.main}40`
            }}>
              <Typography variant="h6" color="success.main" className="text-bold">
                {heatmapData.filter(d => d.category === 'excellent').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Days 10K+
              </Typography>
            </Box>
            <Box className="text-center p-2 rounded" sx={{ 
              backgroundColor: theme.palette.primary.main + '20',
              border: `1px solid ${theme.palette.primary.main}40`
            }}>
              <Typography variant="h6" color="primary.main" className="text-bold">
                {heatmapData.filter(d => d.category === 'good').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Days 7.5K-10K
              </Typography>
            </Box>
            <Box className="text-center p-2 rounded" sx={{ 
              backgroundColor: theme.palette.warning.main + '20',
              border: `1px solid ${theme.palette.warning.main}40`
            }}>
              <Typography variant="h6" color="warning.main" className="text-bold">
                {heatmapData.filter(d => d.category === 'moderate').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Days 5K-7.5K
              </Typography>
            </Box>
            <Box className="text-center p-2 rounded" sx={{ 
              backgroundColor: theme.palette.error.main + '20',
              border: `1px solid ${theme.palette.error.main}40`
            }}>
              <Typography variant="h6" color="error.main" className="text-bold">
                {heatmapData.filter(d => d.category === 'low').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Days &lt;5K
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 