import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  useTheme,
  Grid
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatNumber } from '../utils/helpers';

export default function WeeklyPerformanceChart({ dailySteps }) {
  const theme = useTheme();

  // Group data by weeks
  const weeklyData = React.useMemo(() => {
    if (!dailySteps || dailySteps.length === 0) return [];

    const weeks = [];
    const daysPerWeek = 7;

    for (let i = 0; i < dailySteps.length; i += daysPerWeek) {
      const weekSteps = dailySteps.slice(i, i + daysPerWeek);
      const weekTotal = weekSteps.reduce((sum, steps) => sum + steps, 0);
      const weekAverage = Math.round(weekTotal / weekSteps.length);
      const activeDays = weekSteps.filter(steps => steps > 0).length;
      const daysOver10k = weekSteps.filter(steps => steps >= 10000).length;

      weeks.push({
        week: Math.floor(i / daysPerWeek) + 1,
        total: weekTotal,
        average: weekAverage,
        activeDays,
        daysOver10k,
        bestDay: Math.max(...weekSteps)
      });
    }

    return weeks;
  }, [dailySteps]);

  if (weeklyData.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="text-center p-4">
          <Typography variant="h6" color="text.secondary">
            No weekly data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card" sx={{ 
      display: { xs: 'none', md: 'block' } // Hide on mobile, show on desktop
    }}>
      <CardContent className="p-4">
        <Typography variant="h5" className="text-bold mb-3 text-center">
          📊 Weekly Performance Overview
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="week" 
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8
              }}
              formatter={(value, name) => [
                formatNumber(value), 
                name === 'total' ? 'Total Steps' : 
                name === 'average' ? 'Average/Day' : 
                name === 'bestDay' ? 'Best Day' : name
              ]}
              labelFormatter={(label) => `Week ${label}`}
            />
            <Area
              type="monotone"
              dataKey="total"
              stackId="1"
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.main}
              fillOpacity={0.3}
              name="Total Steps"
            />
            <Area
              type="monotone"
              dataKey="average"
              stackId="2"
              stroke={theme.palette.success.main}
              fill={theme.palette.success.main}
              fillOpacity={0.3}
              name="Average/Day"
            />
            <Line
              type="monotone"
              dataKey="bestDay"
              stroke={theme.palette.warning.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.warning.main, strokeWidth: 2, r: 4 }}
              name="Best Day"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Weekly Stats Summary */}
        <Box className="mt-4">
          <Grid container spacing={2}>
            {weeklyData.slice(-4).map((week) => (
              <Grid item xs={12} sm={6} md={3} key={week.week}>
                <Box className="text-center p-2 rounded" sx={{ 
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="h6" className="text-bold" color="primary">
                    Week {week.week}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(week.total)} total
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {week.daysOver10k} days over 10K
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
} 