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
        className="text-gradient-primary text-bolder mb-3"
      >
        🏆 Personal Records
      </Typography>
      
      <Grid container spacing={3} className="mb-4">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-3">
              <Box className="flex-center mb-2">
                <EmojiEventsIcon sx={{ color: theme.palette.warning.main, fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.warning.main }}>
                {formatNumber(records.bestDay?.steps || 0)}
              </Typography>
              <Typography variant="h6" className="text-bold mb-1">
                Best Single Day
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {records.bestDay?.date || 'No data'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-3">
              <Box className="flex-center mb-2">
                <CalendarMonthIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                {records.bestMonth ? `Month ${records.bestMonth.month}` : 'N/A'}
              </Typography>
              <Typography variant="h6" className="text-bold mb-1">
                Best Month
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {records.bestMonth ? `${formatNumber(records.bestMonth.total)} steps` : 'No data'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-3">
              <Box className="flex-center mb-2">
                <LocalFireDepartmentIcon sx={{ color: theme.palette.success.main, fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.success.main }}>
                {stats.bestStreak}
              </Typography>
              <Typography variant="h6" className="text-bold mb-1">
                Best Active Streak
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.currentStreak} days current
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-3">
              <Box className="flex-center mb-2">
                <TrendingUpIcon sx={{ color: theme.palette.info.main, fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.info.main }}>
                {formatNumber(records.totalRecords?.totalSteps || 0)}
              </Typography>
              <Typography variant="h6" className="text-bold mb-1">
                Total Steps
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {records.totalRecords?.daysTracked || 0} days tracked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trends Section */}
      <Typography 
        variant="h4" 
        className="text-gradient-primary text-bolder mb-3"
      >
        📈 Performance Trends
      </Typography>
      
      <Grid container spacing={3} className="mb-4">
        <Grid item xs={12} md={4}>
          <Card className="glass-card">
            <CardContent className="text-center p-3">
              <Box className="flex-center mb-2">
                {getTrendIcon()}
              </Box>
              <Typography variant="h6" className="text-bold mb-1">
                Weekly Trend
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: getTrendColor(),
                  fontWeight: 600,
                  mb: 1
                }}
              >
                {trends.weeklyTrend === 'improving' ? 'Improving' : 
                 trends.weeklyTrend === 'declining' ? 'Declining' : 'Stable'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getTrendText()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="glass-card">
            <CardContent className="text-center p-3">
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: theme.palette.primary.main }}>
                {stats.activityRate}%
              </Typography>
              <Typography variant="h6" className="text-bold mb-1">
                Activity Rate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.activeDays} of {stats.totalDays} days active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="glass-card">
            <CardContent className="text-center p-3">
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: theme.palette.success.main }}>
                {trends.consistency}%
              </Typography>
              <Typography variant="h6" className="text-bold mb-1">
                Consistency
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
            className="text-gradient-primary text-bolder mb-3"
          >
            📅 Monthly Performance
          </Typography>
          
          <Paper className="paper-glass p-4 mb-4">
            <Grid container spacing={2}>
              {Object.entries(monthlyData).map(([month, data]) => (
                <Grid item xs={12} sm={6} md={3} key={month}>
                  <Card className="glass-card">
                    <CardContent className="text-center p-2">
                      <Typography variant="h6" className="text-bold mb-1">
                        Month {month}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                        {formatNumber(data.total)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.daysOver10k} days over 10K
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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
        className="text-gradient-primary text-bolder mb-3"
      >
        📊 Detailed Statistics
      </Typography>

      <Grid container spacing={3} className="mb-4">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-2">
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.warning.main }}>
                {formatNumber(stats.highestDay)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highest Single Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-2">
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.info.main }}>
                {stats.daysOver10k}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Over 10K Steps
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-2">
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.success.main }}>
                {stats.daysOver5k}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Over 5K Steps
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="glass-card">
            <CardContent className="text-center p-2">
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.secondary.main }}>
                {formatNumber(stats.lowestDay)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
            className="text-gradient-primary text-bolder mb-3"
          >
            💡 Smart Insights
          </Typography>

          <Paper className="paper-glass p-3">
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
                        className: 'text-bold'
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