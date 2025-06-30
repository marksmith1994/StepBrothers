import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { formatNumber } from '../utils/helpers';

export default function AnalyticsDashboard({ analytics }) {
  const theme = useTheme();
  const { trends, insights, stats, records, monthlyData } = analytics;

  const getTrendIcon = () => {
    switch (trends.weeklyTrend) {
      case 'improving':
        return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
      case 'declining':
        return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <TrendingFlatIcon sx={{ color: theme.palette.warning.main }} />;
    }
  };

  const getTrendColor = () => {
    switch (trends.weeklyTrend) {
      case 'improving':
        return theme.palette.success.main;
      case 'declining':
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  const getTrendText = () => {
    switch (trends.weeklyTrend) {
      case 'improving':
        return `+${trends.improvement}% from last week`;
      case 'declining':
        return `${trends.improvement}% from last week`;
      default:
        return 'Stable compared to last week';
    }
  };

  return (
    <Box>
      {/* Records Section */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 800,
          mb: 3,
          background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
        🏆 Personal Records
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ color: theme.palette.warning.main, fontSize: { xs: 32, sm: 40 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.warning.main,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {formatNumber(records.bestDay?.steps || 0)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Best Single Day
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {records.bestDay?.date || 'No data'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CalendarMonthIcon sx={{ color: theme.palette.primary.main, fontSize: { xs: 32, sm: 40 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.primary.main,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {records.bestMonth ? `Month ${records.bestMonth.month}` : 'N/A'}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Best Month
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {records.bestMonth ? `${formatNumber(records.bestMonth.total)} steps` : 'No data'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <LocalFireDepartmentIcon sx={{ color: theme.palette.success.main, fontSize: { xs: 32, sm: 40 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.success.main,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {stats.bestStreak}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Best Active Streak
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {stats.currentStreak} days current
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: theme.palette.info.main, fontSize: { xs: 32, sm: 40 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.info.main,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {formatNumber(records.totalRecords?.totalSteps || 0)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Total Steps
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {records.totalRecords?.daysTracked || 0} days tracked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trends Section */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 800,
          mb: 3,
          background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
        📈 Performance Trends
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {getTrendIcon()}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Weekly Trend
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: getTrendColor(),
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {trends.weeklyTrend === 'improving' ? 'Improving' : 
                 trends.weeklyTrend === 'declining' ? 'Declining' : 'Stable'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {getTrendText()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 900, 
                mb: 1, 
                color: theme.palette.primary.main,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
              }}>
                {stats.activityRate}%
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Activity Rate
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {stats.activeDays} of {stats.totalDays} days active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 900, 
                mb: 1, 
                color: theme.palette.success.main,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
              }}>
                {trends.consistency}%
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Consistency
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Days within 20% of your average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Performance Chart */}
      {Object.keys(monthlyData).length > 0 && (
        <>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            📅 Monthly Performance
          </Typography>
          
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={2}>
              {Object.entries(monthlyData).map(([month, data]) => (
                <Grid xs={12} sm={6} md={3} key={month}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.875rem', sm: '1.25rem' } }}>
                        Month {month}
                      </Typography>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 900, 
                        color: theme.palette.primary.main,
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                      }}>
                        {formatNumber(data.total)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {data.daysOver10k} days over 10K
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                        Avg: {formatNumber(data.average)}/day
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      )}

      {/* Additional Stats */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 800,
          mb: 3,
          background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
        📊 Detailed Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.warning.main,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
              }}>
                {formatNumber(stats.highestDay)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Highest Single Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.info.main,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
              }}>
                {stats.daysOver10k}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Days Over 10K Steps
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.success.main,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
              }}>
                {stats.daysOver5k}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Days Over 5K Steps
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.secondary.main,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
              }}>
                {formatNumber(stats.lowestDay)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Lowest Active Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insights Section */}
      {insights.length > 0 && (
        <>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            💡 Smart Insights
          </Typography>

          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <List>
              {insights.map((insight, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LightbulbIcon sx={{ color: theme.palette.warning.main }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={insight}
                      primaryTypographyProps={{
                        variant: 'body1',
                        sx: { fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }
                      }}
                    />
                  </ListItem>
                  {index < insights.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Box>
  );
} 