import React from 'react';
import { Box, Typography, Paper, useTheme, Container, Tabs, Tab, FormControl, Select, MenuItem, Card, CardContent, Grid, Chip, Alert, CircularProgress, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useStepsData } from '../hooks/useStepsData';
import Leaderboard from '../components/Leaderboard';
import StepLineChart from '../components/StepLineChart';
import CumulativeStepsChart from '../components/CumulativeStepsChart';
import WeeklyPerformanceChart from '../components/WeeklyPerformanceChart';
import ConsistencyHeatmap from '../components/ConsistencyHeatmap';
import DailyRankTable from '../components/DailyRankTable';
import MonthlyWinnersTable from '../components/MonthlyWinnersTable';
import AllTimeBestsTable from '../components/AllTimeBestsTable';
import BadgesSection from '../components/BadgesSection';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StarIcon from '@mui/icons-material/Star';
import { formatNumber } from '../utils/helpers';
import { GRID_CONFIG } from '../constants';
import Fade from '@mui/material/Fade';
import { DashboardSkeleton } from '../components/LoadingSkeleton';

// Helper function to format date properly
const formatDate = (dayString) => {
  if (!dayString) return 'N/A';
  
  // Convert to string first to handle different data types
  const dayStr = String(dayString);
  
  // If it's already a date string, try to parse it
  if (dayStr.includes('/') || dayStr.includes('-')) {
    const date = new Date(dayStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit' 
      });
    }
  }
  
  // If it's a day number, convert to a proper calendar date
  const dayNumber = parseInt(dayStr);
  if (!isNaN(dayNumber)) {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, 0, dayNumber); // January 1st + dayNumber
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  }
  
  return dayStr;
};

// Helper function to get proper calendar month dates
const getMonthDateRange = (monthName, year = new Date().getFullYear()) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = months.indexOf(monthName);
  if (monthIndex === -1) return null;
  
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0); // Last day of the month
  
  return { startDate, endDate };
};

// Helper function to check if a day falls within a specific month
const isDayInMonth = (dayNumber, monthName, year = new Date().getFullYear()) => {
  const dateRange = getMonthDateRange(monthName, year);
  if (!dateRange) return false;
  
  const dayDate = new Date(year, 0, dayNumber); // Convert day number to date
  return dayDate >= dateRange.startDate && dayDate <= dateRange.endDate;
};

// Get proper calendar months with correct day counts
const getCalendarMonths = () => {
  const currentYear = new Date().getFullYear();
  const months = [
    { name: 'January', days: 31 },
    { name: 'February', days: new Date(currentYear, 2, 0).getDate() }, // Accounts for leap years
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 }
  ];
  
  return months;
};

const MONTHS = [
  'dashboard', 
  ...getCalendarMonths().map(month => month.name)
];

export default function Dashboard() {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = React.useState('dashboard');
  
  const { data: stepData, loading, error } = useStepsData({ tab: selectedMonth });

  // Filter data by proper calendar month on frontend
  const filteredStepData = React.useMemo(() => {
    if (!stepData || selectedMonth === 'dashboard') {
      return stepData;
    }

    // Filter daily data by proper calendar month
    const filteredDailyData = stepData.dailyData?.filter(entry => {
      if (!entry.day) return false;
      return isDayInMonth(entry.day, selectedMonth);
    }) || [];

    // Recalculate participant data for filtered data
    const filteredParticipantData = stepData.participants?.map(participant => {
      const participantData = {
        name: participant,
        totalSteps: 0,
        averageSteps: 0,
        highestSingleDay: 0,
        dailySteps: [],
        currentStreak: 0,
        bestStreak: 0,
        wins: 0,
        monthlyWins: 0
      };

      filteredDailyData.forEach(dayEntry => {
        const steps = dayEntry.steps[participant] || 0;
        participantData.dailySteps.push(steps);
        participantData.totalSteps += steps;
        participantData.highestSingleDay = Math.max(participantData.highestSingleDay, steps);
      });

      participantData.averageSteps = participantData.dailySteps.length > 0 
        ? participantData.totalSteps / participantData.dailySteps.length 
        : 0;

      return participantData;
    }) || [];

    return {
      ...stepData,
      dailyData: filteredDailyData,
      participantData: filteredParticipantData
    };
  }, [stepData, selectedMonth]);

  let columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50, hide: true },
    { 
      field: 'day', 
      headerName: 'Date', 
      flex: 1.2,
      minWidth: 100,
      renderCell: (params) => (
        <Typography component="span" sx={{ 
          fontWeight: 500,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {formatDate(params.value)}
        </Typography>
      )
    },
  ];
  let rows = [];

  if (filteredStepData && filteredStepData.participants && filteredStepData.dailyData && filteredStepData.dailyData.length > 0) {
    const participants = filteredStepData.participants;
    
    columns = [
      { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50, hide: true },
      { 
        field: 'day', 
        headerName: 'Date', 
        flex: 1.2,
        minWidth: 100,
        renderCell: (params) => (
          <Typography component="span" sx={{ 
            fontWeight: 500,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            {formatDate(params.value)}
          </Typography>
        )
      },
      ...participants.map(person => ({
        field: person,
        headerName: person.charAt(0).toUpperCase() + person.slice(1),
        flex: 1,
        minWidth: 80,
        renderCell: (params) => {
          const row = params.row;
          const values = participants.map(p => Number(row[p]?.toString().replace(/,/g, '')) || 0).filter(v => !isNaN(v));
          const max = Math.max(...values);
          const isMax = Number(row[person]?.toString().replace(/,/g, '')) === max && max !== -Infinity;
          const formatted = row[person] ? Number(row[person].toString().replace(/,/g, '')).toLocaleString() : '';
          return (
            <Typography component="span" sx={{ 
              fontWeight: isMax ? 700 : 400, 
              color: isMax ? 'primary.main' : 'inherit',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}>
              {formatted}
            </Typography>
          );
        }
      })),
      { 
        field: 'total', 
        headerName: 'Total', 
        flex: 1,
        minWidth: 80,
        renderCell: (params) => (
          <Typography component="span" sx={{ 
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            {params.value ? Number(params.value).toLocaleString() : '0'}
          </Typography>
        )
      },
    ];

    rows = filteredStepData.dailyData.map((entry, idx) => {
      const row = {
        id: idx + 1,
        day: entry.day,
        total: entry.total,
      };
      participants.forEach(person => {
        row[person] = entry.steps[person] ?? 0;
      });
      return row;
    });
  }

  const isLoading = loading;
  const hasError = error;

  // Calculate quick stats
  const quickStats = React.useMemo(() => {
    if (!filteredStepData || !filteredStepData.participantData || !filteredStepData.dailyData) return null;

    const participants = filteredStepData.participantData;
    const dailyData = filteredStepData.dailyData;

    // Total team steps
    const totalTeamSteps = participants.reduce((sum, p) => sum + (p.totalSteps || 0), 0);
    
    // Average daily steps across team
    const totalDays = dailyData.length;
    const avgDailySteps = totalDays > 0 ? Math.round(totalTeamSteps / totalDays) : 0;
    
    // Most active participant
    const mostActive = participants.reduce((max, p) => 
      (p.averageSteps || 0) > (max.averageSteps || 0) ? p : max, participants[0]
    );

    // Yesterday's winner
    const yesterday = dailyData[dailyData.length - 1];
    let yesterdaysWinner = null;
    if (yesterday && yesterday.steps) {
      const winnerEntry = Object.entries(yesterday.steps).reduce((max, [name, steps]) => 
        (steps || 0) > (max.steps || 0) ? { name, steps } : max, { name: '', steps: 0 }
      );
      if (winnerEntry.name && winnerEntry.steps > 0) {
        yesterdaysWinner = {
          name: winnerEntry.name,
          steps: winnerEntry.steps,
          day: yesterday.day
        };
      }
    }

    // Recent activity (last 7 days)
    const last7Days = dailyData.slice(-7);
    const recentActivity = last7Days.reduce((sum, day) => sum + (day.total || 0), 0);

    return {
      totalTeamSteps,
      avgDailySteps,
      mostActive,
      yesterdaysWinner,
      recentActivity,
      totalParticipants: participants.length,
      totalDays
    };
  }, [filteredStepData]);

  return (
    <Container maxWidth="xl" disableGutters sx={{ 
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Fade in timeout={800}>
        <Box>
          {/* Enhanced Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
            borderRadius: 3,
            p: { xs: 3, sm: 4, md: 6 },
            mb: { xs: 3, sm: 4, md: 6 },
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                  fontWeight: 900,
                  mb: { xs: 2, sm: 3 },
                  lineHeight: 1.1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                🏃‍♂️ Step Brothers Dashboard
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  maxWidth: 700, 
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  px: { xs: 1, sm: 0 },
                  opacity: 0.95,
                  fontWeight: 400
                }}
              >
                Track your daily steps, compete with friends, and stay motivated on your fitness journey!
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats Cards */}
          {!isLoading && !hasError && quickStats && (
            <Grid container spacing={3} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ 
                      width: { xs: 50, sm: 60 }, 
                      height: { xs: 50, sm: 60 }, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: { xs: 1.5, sm: 2 }
                    }}>
                      <DirectionsRunIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: theme.palette.primary.main, 
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                    }}>
                      {formatNumber(quickStats.totalTeamSteps)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Total Team Steps
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ 
                      width: { xs: 50, sm: 60 }, 
                      height: { xs: 50, sm: 60 }, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: { xs: 1.5, sm: 2 }
                    }}>
                      <TrendingUpIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: '#10b981', 
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                    }}>
                      {formatNumber(quickStats.avgDailySteps)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Avg Daily Steps
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ 
                      width: { xs: 50, sm: 60 }, 
                      height: { xs: 50, sm: 60 }, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: { xs: 1.5, sm: 2 }
                    }}>
                      <PersonIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: '#8b5cf6', 
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                    }}>
                      {quickStats.totalParticipants}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Participants
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Most Active */}
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Card sx={{ width: '100%', height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: { xs: 40, sm: 50 }, 
                        height: { xs: 40, sm: 50 }, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: { xs: 2, sm: 3 }
                      }}>
                        <EmojiEventsIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: '#f59e0b',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          🏆 Most Active
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Highest average steps
                        </Typography>
                      </Box>
                    </Box>
                    {quickStats.mostActive ? (
                      <Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 800, 
                          mb: 1,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                          {quickStats.mostActive.name}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          color: '#f59e0b', 
                          fontWeight: 700,
                          fontSize: { xs: '0.95rem', sm: '1.1rem' }
                        }}>
                          {formatNumber(quickStats.mostActive.averageSteps)} avg steps
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Total: {formatNumber(quickStats.mostActive.totalSteps)} steps
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        No data available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              {/* Yesterday's Winner */}
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Card sx={{ width: '100%', height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: { xs: 40, sm: 50 }, 
                        height: { xs: 40, sm: 50 }, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: { xs: 2, sm: 3 }
                      }}>
                        <StarIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: '#10b981',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          ⭐ Yesterday's Winner
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Highest steps yesterday
                        </Typography>
                      </Box>
                    </Box>
                    {quickStats.yesterdaysWinner ? (
                      <Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 800, 
                          mb: 1,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                          {quickStats.yesterdaysWinner.name}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          color: '#10b981', 
                          fontWeight: 700,
                          fontSize: { xs: '0.95rem', sm: '1.1rem' }
                        }}>
                          {formatNumber(quickStats.yesterdaysWinner.steps)} steps
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Date: {quickStats.yesterdaysWinner.day}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        No data available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Enhanced Filter Section */}
          <Paper sx={{ 
            p: { xs: 2, sm: 3, md: 4, lg: 6 },
            mb: { xs: 3, sm: 4, md: 6 },
            borderRadius: 3
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', lg: 'row' }, 
              gap: { xs: 2, sm: 3, lg: 4 }, 
              alignItems: { xs: 'stretch', lg: 'center' } 
            }}>
              {/* Filter Controls */}
              <Box sx={{ flex: { xs: '1', lg: '0 0 auto' }, minWidth: { lg: 300 } }}>
                <Typography variant="h5" sx={{ 
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                  mb: { xs: 2, sm: 3 },
                  fontWeight: 700
                }}>
                  📅 Filter Data
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: { xs: 2, sm: 3 }, 
                  alignItems: { xs: 'stretch', sm: 'center' } 
                }}>
                  <FormControl fullWidth>
                    <InputLabel id="month-select-label">Select Month</InputLabel>
                    <Select
                      labelId="month-select-label"
                      value={selectedMonth}
                      label="Select Month"
                      onChange={e => setSelectedMonth(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(102, 126, 234, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(102, 126, 234, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                        '@media (max-width: 600px)': {
                          fontSize: '0.875rem'
                        }
                      }}
                    >
                      {MONTHS.map(month => (
                        <MenuItem key={month} value={month}>
                          {month === 'dashboard' ? '📊 All Data' : `📅 ${month}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Data Summary */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  📈 Data Summary
                </Typography>
                
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={6} sm={6} md={3}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      borderRadius: 2, 
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: theme.palette.primary.main,
                        fontSize: { xs: '0.875rem', sm: '1.25rem' }
                      }}>
                        {selectedMonth === 'dashboard' ? 'All Data' : selectedMonth}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
                        Current View
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={6} md={3}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      borderRadius: 2, 
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#10b981',
                        fontSize: { xs: '0.875rem', sm: '1.25rem' }
                      }}>
                        {rows.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
                        Days of Data
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={6} md={3}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      borderRadius: 2, 
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#f59e0b',
                        fontSize: { xs: '0.875rem', sm: '1.25rem' }
                      }}>
                        {filteredStepData?.participants?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
                        Participants
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={6} md={3}>
                    <Box sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      borderRadius: 2, 
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: '#8b5cf6',
                        fontSize: { xs: '0.875rem', sm: '1.25rem' }
                      }}>
                        {filteredStepData?.dailyData?.length > 0 ? formatNumber(filteredStepData.dailyData[filteredStepData.dailyData.length - 1]?.total || 0) : '0'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
                        Latest Total
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>

          {isLoading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '40vh',
              flexDirection: 'column',
              gap: 3,
              py: { xs: 4, sm: 6 }
            }}>
              <DashboardSkeleton />
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Loading step data...
              </Typography>
            </Box>
          )}

          {hasError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            >
              {error}
            </Alert>
          )}

          {!isLoading && !hasError && (
            <Fade in timeout={600}>
              <Box>
                {/* Leaderboard Section */}
                <Typography variant="h3" sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  mb: { xs: 3, sm: 4 },
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🏆 Overall Leaderboard
                </Typography>
                <Box sx={{
                  mb: { xs: 4, sm: 6 },
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(102, 126, 234, 0.08)',
                  p: { xs: 1, sm: 2, md: 3 }
                }}>
                  <Leaderboard tab={selectedMonth} />
                </Box>

                {/* Data Grid Section */}
                <Typography variant="h3" className="text-gradient-primary text-bolder mb-4" sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  mb: { xs: 3, sm: 4 }
                }}>
                  📋 Detailed Step Data
                </Typography>

                {/* Data Grid */}
                <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    mb: 3, 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    📊 Data Table
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10, 25, 50]}
                      disableSelectionOnClick
                      autoHeight
                      sx={{
                        '& .MuiDataGrid-cell': {
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: theme.palette.grey[50],
                          borderBottom: '2px solid rgba(224, 224, 224, 1)',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                          backgroundColor: theme.palette.background.paper,
                        },
                        '& .MuiDataGrid-footerContainer': {
                          borderTop: '2px solid rgba(224, 224, 224, 1)',
                          backgroundColor: theme.palette.grey[50],
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>
    </Container>
  );
} 