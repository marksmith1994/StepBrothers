import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Typography, Box, useTheme } from '@mui/material';

export default function StepLineChart({ data, title }) {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 300,
        color: theme.palette.text.secondary
      }}>
        <Typography variant="h6">No data available</Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          p: { xs: 1.5, sm: 2 },
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          <Typography variant="body2" sx={{ 
            fontWeight: 600, 
            mb: 1,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            Day {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ 
                color: entry.color,
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {entry.name}: {entry.value?.toLocaleString()} steps
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {title && (
        <Typography 
          variant="h6" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ 
            top: { xs: 10, sm: 20 }, 
            right: { xs: 10, sm: 30 }, 
            left: { xs: 10, sm: 20 }, 
            bottom: { xs: 10, sm: 20 } 
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.divider}
            opacity={0.3}
          />
          <XAxis 
            dataKey="day" 
            stroke={theme.palette.text.secondary}
            fontSize={{ xs: 10, sm: 12 }}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: { xs: 10, sm: 12 } }}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            fontSize={{ xs: 10, sm: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
            tick={{ fontSize: { xs: 10, sm: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{
              paddingTop: { xs: 5, sm: 10 },
              fontSize: { xs: 10, sm: 12 }
            }}
          />
          <Line 
            type="monotone" 
            dataKey="steps" 
            name="Daily Steps" 
            stroke={theme.palette.primary.main} 
            strokeWidth={{ xs: 2, sm: 3 }}
            dot={{ 
              fill: theme.palette.primary.main, 
              strokeWidth: 2, 
              r: { xs: 3, sm: 4 }
            }}
            activeDot={{ 
              r: { xs: 5, sm: 6 }, 
              stroke: theme.palette.primary.main, 
              strokeWidth: 2 
            }}
          />
          {data[0]?.total !== undefined && (
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Total Steps" 
              stroke={theme.palette.success.main} 
              strokeWidth={{ xs: 1.5, sm: 2 }}
              strokeDasharray="5 5"
              dot={{ 
                fill: theme.palette.success.main, 
                strokeWidth: 2, 
                r: { xs: 2, sm: 3 }
              }}
              activeDot={{ 
                r: { xs: 4, sm: 5 }, 
                stroke: theme.palette.success.main, 
                strokeWidth: 2 
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
