import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Container,
  Paper,
  useTheme,
  Fade,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useStepsData } from '../hooks/useStepsData';
import Leaderboard from '../components/Leaderboard';
import { GRID_CONFIG } from '../constants';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StarIcon from '@mui/icons-material/Star';
import { getInitials, formatNumber } from '../utils/helpers';

// Get current month and year
const getCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleString('default', { month: 'long' });
};

// Helper function to format date
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
  
  // If it's a day number, convert to a date (assuming current year)
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

const MONTHS = [
  'dashboard', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = React.useState('dashboard');
  
  const { data: stepData, loading, error } = useStepsData({ tab: selectedMonth });

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

  if (stepData && stepData.participants && stepData.dailyData && stepData.dailyData.length > 0) {
    const participants = stepData.participants;
    
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

    rows = stepData.dailyData.map((entry, idx) => {
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
    if (!stepData || !stepData.participantData || !stepData.dailyData) return null;

    const participants = stepData.participantData;
    const dailyData = stepData.dailyData;

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
  }, [stepData]);

  return (
    <Container maxWidth="xl" sx={{ 
      py: { xs: 1, sm: 2, md: 4 },
      px: { xs: 1, sm: 2, md: 3 }
    }}>
      <Fade in timeout={800}>
        <Box>
          {/* Enhanced Header */}
          <Box className="gradient-primary-light rounded-lg p-4 mb-4" sx={{ 
            p: { xs: 2, sm: 3, md: 4, lg: 6 },
            mb: { xs: 2, sm: 3, md: 4, lg: 6 }
          }}>
            <Typography 
              variant="h2" 
              className="text-gradient-primary text-boldest mb-3"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' },
                textAlign: 'center',
                mb: { xs: 1, sm: 2, md: 3 },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
              }}
            >
              🏃‍♂️ Step Brothers Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              className="text-center"
              sx={{ 
                maxWidth: 700, 
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.1rem' },
                px: { xs: 1, sm: 0 }
              }}
            >
              Track your daily steps, compete with friends, and stay motivated on your fitness journey!
            </Typography>
          </Box>

          {/* Quick Stats Cards */}
          {!isLoading && !hasError && quickStats && (
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 3, sm: 4, md: 6 } }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card className="stat-card">
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
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
                <Card className="stat-card">
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
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
                <Card className="stat-card">
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
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
            </Grid>
          )}

          {/* Enhanced Filter Section */}
          <Paper className="paper-glass p-4 mb-4" sx={{ 
            p: { xs: 2, sm: 3, md: 4, lg: 6 },
            mb: { xs: 3, sm: 4, md: 6 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', lg: 'row' }, 
              gap: { xs: 2, sm: 3, lg: 4 }, 
              alignItems: { xs: 'stretch', lg: 'center' } 
            }}>
              {/* Filter Controls */}
              <Box sx={{ flex: { xs: '1', lg: '0 0 auto' }, minWidth: { lg: 300 } }}>
                <Typography variant="h5" className="text-bold mb-3" sx={{ 
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                  mb: { xs: 2, sm: 3 }
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
                        {stepData?.participants?.length || 0}
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
                        {stepData?.dailyData?.length > 0 ? formatNumber(stepData.dailyData[stepData.dailyData.length - 1]?.total || 0) : '0'}
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
              <CircularProgress 
                size={80} 
                thickness={4}
                sx={{ 
                  color: theme.palette.primary.main,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
              />
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
                {/* Top Performers */}
                <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 4, sm: 6 } }}>
                  {/* Most Active Participant */}
                  <Grid item xs={12} md={6}>
                    <Card className="performer-card">
                      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box sx={{ 
                            width: { xs: 50, sm: 60 }, 
                            height: { xs: 50, sm: 60 }, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: { xs: 2, sm: 3 }
                          }}>
                            <EmojiEventsIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
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
                              fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}>
                              {quickStats.mostActive.name}
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              color: '#f59e0b', 
                              fontWeight: 700,
                              fontSize: { xs: '1rem', sm: '1.25rem' }
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
                  <Grid item xs={12} md={6}>
                    <Card className="performer-card">
                      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box sx={{ 
                            width: { xs: 50, sm: 60 }, 
                            height: { xs: 50, sm: 60 }, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: { xs: 2, sm: 3 }
                          }}>
                            <StarIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
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
                              fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}>
                              {quickStats.yesterdaysWinner.name}
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              color: '#10b981', 
                              fontWeight: 700,
                              fontSize: { xs: '1rem', sm: '1.25rem' }
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

                {/* Leaderboard Section */}
                <Typography variant="h3" className="text-gradient-primary text-bolder mb-4" sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  mb: { xs: 3, sm: 4 }
                }}>
                  🏆 Overall Leaderboard
                </Typography>
                <Paper className="paper-glass mb-6" sx={{ mb: { xs: 4, sm: 6 } }}>
                  <Leaderboard tab={selectedMonth} />
                </Paper>

                {/* Data Grid Section */}
                <Typography variant="h3" className="text-gradient-primary text-bolder mb-4" sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  mb: { xs: 3, sm: 4 }
                }}>
                  📋 Detailed Step Data
                </Typography>

                {/* Data Grid */}
                <Paper className="paper-glass" sx={{ overflow: 'hidden' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={GRID_CONFIG.PAGE_SIZE}
                    rowsPerPageOptions={GRID_CONFIG.PAGE_SIZE_OPTIONS}
                    disableSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-root': {
                        border: 'none',
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        padding: { xs: '8px 4px', sm: '16px' }
                      },
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
                      },
                      '& .MuiDataGrid-columnHeader': {
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        padding: { xs: '8px 4px', sm: '16px' }
                      },
                      '& .MuiDataGrid-footerContainer': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }
                    }}
                  />
                </Paper>
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>
    </Container>
  );
} 