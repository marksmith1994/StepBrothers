import React from "react";
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Alert, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  useTheme,
  Avatar,
  Chip,
  Fade,
  Container,
  Tabs,
  Tab
} from '@mui/material';
import StepLineChart from '../components/StepLineChart';
import { useStepsData } from '../hooks/useStepsData';
import PersonPageSkeleton from '../components/PersonPageSkeleton';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { getInitials, formatNumber } from '../utils/helpers';
import { STREAK_CONFIG } from '../constants';
import { calculateAchievements, getAchievementStats } from '../utils/achievements';
import { calculatePersonalAnalytics } from '../utils/analytics';
import AchievementCard from '../components/AchievementCard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ComparisonTable from '../components/ComparisonTable';

export default function PersonPage() {
  const theme = useTheme();
  const { name } = useParams();
  
  // Add state for active tab
  const [tabValue, setTabValue] = React.useState(0);
  
  // Fetch data for specific person
  const { data: personData, loading, error } = useStepsData({ person: name });

  // Calculate achievements and analytics
  const achievements = React.useMemo(() => {
    return calculateAchievements(personData);
  }, [personData]);
  
  const analytics = React.useMemo(() => 
    calculatePersonalAnalytics(personData), [personData]
  );
  
  const achievementStats = React.useMemo(() => 
    getAchievementStats(achievements), [achievements]
  );

  // Set page title on mount
  React.useEffect(() => {
    document.title = `${name} - Step Brothers`;
    return () => {
      document.title = 'Step Brothers Dashboard';
    };
  }, [name]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!personData) return [];
    
    // Handle different possible data structures
    if (personData.dailySteps && Array.isArray(personData.dailySteps)) {
      return personData.dailySteps.map((steps, index) => ({
        day: index + 1,
        steps: steps,
        total: steps
      }));
    }
    
    // If data is in a different format, try to extract it
    if (personData.dailyData && Array.isArray(personData.dailyData)) {
      return personData.dailyData.map((entry, index) => ({
        day: index + 1,
        steps: entry.steps || 0,
        total: entry.steps || 0
      }));
    }
    
    // Fallback: create empty chart data
    return [];
  }, [personData]);

  const getStatCard = (title, value, icon, color, subtitle = null) => (
    <Card sx={{
      height: '100%',
      textAlign: 'center',
      borderRadius: 3,
      boxShadow: 3,
      p: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <CardContent sx={{ p: 0, width: '100%' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          {React.cloneElement(icon, {
            sx: {
              color: color,
              fontSize: 48,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            },
          })}
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: color,
            mb: 1,
            textShadow: `0 2px 8px ${color}30`,
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          {formatNumber(value)}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            mb: subtitle ? 0.5 : 0,
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: '1rem', sm: 3, md: 4 } }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                borderRadius: 3,
                p: { xs: 3, sm: 4 },
                mb: { xs: 2, sm: 3 },
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    fontSize: { xs: 24, sm: 32 },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                    color: 'white',
                    boxShadow: 2,
                  }}
                >
                  {getInitials(name)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                      mb: { xs: 0.5, sm: 1 },
                      fontWeight: 900,
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {name}
                  </Typography>
                  <Chip
                    label="Step Brother"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                      background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                      color: 'white',
                      fontWeight: 700,
                      mt: 1,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          
          {loading && <PersonPageSkeleton />}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          {!loading && !error && personData && (
            <Fade in timeout={600}>
              <Box>
                {/* Tabs */}
                <Paper 
                  sx={{ 
                    mb: { xs: 3, sm: 4 }, 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'visible',
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                      '& .MuiTab-root': { 
                        fontWeight: 700, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        minHeight: { xs: 48, sm: 56, md: 72 },
                        textTransform: 'none',
                        letterSpacing: 0.5,
                        transition: 'all 0.3s ease',
                        '&.Mui-selected': {
                          color: theme.palette.primary.main,
                          transform: 'translateY(-2px)'
                        }
                      },
                      '& .MuiTabs-indicator': {
                        height: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      },
                      '& .MuiTabs-scrollButtons': {
                        color: theme.palette.primary.main,
                        '&.Mui-disabled': {
                          opacity: 0.3
                        }
                      },
                      '& .MuiTabs-scrollButtons.MuiTabs-scrollButtonsDesktop': {
                        display: { xs: 'flex', sm: 'flex' }
                      },
                      '& .MuiTabs-scrollButtons.MuiTabs-scrollButtonsLeft': {
                        display: { xs: 'flex', sm: 'flex' }
                      },
                      '& .MuiTabs-scrollButtons.MuiTabs-scrollButtonsRight': {
                        display: { xs: 'flex', sm: 'flex' }
                      }
                    }}
                  >
                    <Tab label="📊 Overview" />
                    <Tab label="🏆 Achievements" />
                    <Tab label="📈 Analytics" />
                    <Tab label="📋 Progress" />
                    <Tab label="⚖️ Comparison" />
                  </Tabs>
                </Paper>

                {/* Tab Content */}
                {tabValue === 0 && (
                  <Box>
                    {/* Basic Stats */}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mb: 3,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}
                    >
                      📊 Basic Statistics
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.primary.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {formatNumber(personData?.totalSteps || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Total Steps
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.success.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {formatNumber(Math.round(personData?.averageSteps || 0))}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Average/Day
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.warning.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {formatNumber(personData?.highestSingleDay || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Best Day
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.error.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {personData?.allTimeWins || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Total Wins
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Gamification Stats */}
                    <Paper sx={{ 
                      p: { xs: 3, sm: 4 }, 
                      mb: 6,
                      background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                      borderRadius: 3,
                      color: 'white'
                    }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          mb: 4, 
                          fontWeight: 800, 
                          color: 'white',
                          textAlign: 'center',
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                        }}
                      >
                        🏆 Achievement Stats
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          {getStatCard(
                            'Current Win Streak',
                            personData.currentWinStreak || 0,
                            <LocalFireDepartmentIcon />,
                            STREAK_CONFIG.COLORS.ORANGE,
                            'Active streak'
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          {getStatCard(
                            'Best Win Streak',
                            personData.bestWinStreak || 0,
                            <EmojiEventsIcon />,
                            STREAK_CONFIG.COLORS.GOLD,
                            'All-time best'
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          {getStatCard(
                            'Current Losing Streak',
                            personData.currentLosingStreak || 0,
                            <TrendingDownIcon />,
                            STREAK_CONFIG.COLORS.RED,
                            'Need to break'
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          {getStatCard(
                            'All-Time Wins',
                            personData.allTimeWins || 0,
                            <StarIcon />,
                            STREAK_CONFIG.COLORS.GREEN,
                            'Total victories'
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    {/* Achievement Overview */}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mb: 3,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}
                    >
                      🏆 Achievements
                    </Typography>

                    {/* Achievement Stats */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.success.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {achievementStats.earned}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Earned
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.warning.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {achievementStats.inProgress}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              In Progress
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.info.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {achievementStats.total}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Total Available
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: '0 !important' }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800, 
                              color: theme.palette.primary.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}>
                              {Math.round((achievementStats.earned / achievementStats.total) * 100)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Completion Rate
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Earned Achievements */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {achievements.filter(a => a.isEarned).map((achievement, index) => (
                        <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                          <AchievementCard 
                            achievement={achievement} 
                            isEarned={true} 
                            showProgress={false}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    {/* In Progress Achievements */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {achievements.filter(a => !a.isEarned && a.progress > 0).map((achievement, index) => (
                        <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                          <AchievementCard 
                            achievement={achievement} 
                            isEarned={false} 
                            showProgress={true}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    {/* Locked Achievements */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {achievements.filter(a => !a.isEarned && a.progress === 0).map((achievement, index) => (
                        <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                          <AchievementCard 
                            achievement={achievement} 
                            isEarned={false} 
                            showProgress={false}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    {/* Analytics Dashboard */}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mb: 3,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}
                    >
                      📊 Analytics
                    </Typography>
                    <Box sx={{ 
                      p: { xs: 2, sm: 3, md: 4 },
                      borderRadius: 3,
                      boxShadow: 2
                    }}>
                      <AnalyticsDashboard analytics={analytics} />
                    </Box>
                  </Box>
                )}

                {tabValue === 3 && (
                  <Box>
                    {/* Progress Overview */}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mb: 4,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #314755 0%, #06b6d4 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}
                    >
                      📈 Progress Tracking
                    </Typography>

                    {/* Progress Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          borderRadius: 3,
                          height: '100%'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.primary.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                            }}>
                              {personData.dailySteps?.length || 0}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Days Tracked
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: 3,
                          height: '100%'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.success.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                            }}>
                              {Math.round(personData.averageSteps || 0)}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Avg Steps/Day
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          borderRadius: 3,
                          height: '100%'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.warning.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                            }}>
                              {personData.highestSingleDay || 0}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Best Single Day
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: 3,
                          height: '100%'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.secondary.main,
                              mb: 1,
                              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                            }}>
                              {personData.totalSteps || 0}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Total Steps
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Main Progress Chart */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                      <Paper sx={{ 
                        p: { xs: 2, sm: 3, md: 4 }, 
                        mb: 4,
                        borderRadius: 3,
                        boxShadow: 2
                      }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            textAlign: 'center',
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                          }}
                        >
                          📊 Daily Step Progress
                        </Typography>
                        <Box sx={{ 
                          height: { xs: 300, sm: 350, md: 400 },
                          width: '100%'
                        }}>
                          <StepLineChart 
                            data={chartData} 
                            title="Daily Steps Over Time"
                          />
                        </Box>
                      </Paper>
                    </Box>

                    {/* Progress Insights */}
                    <Grid container spacing={3}>
                      <Grid xs={12} md={6}>
                        <Paper sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          boxShadow: 2
                        }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 3, 
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                            }}
                          >
                            🎯 Progress Insights
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Days Above 10K
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                                {personData.dailySteps?.filter(steps => steps >= 10000).length || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.2)'
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Days Above 15K
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                                {personData.dailySteps?.filter(steps => steps >= 15000).length || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.2)'
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Days Above 20K
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                                {personData.dailySteps?.filter(steps => steps >= 20000).length || 0}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid xs={12} md={6}>
                        <Paper sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          boxShadow: 2
                        }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 3, 
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                            }}
                          >
                            📈 Performance Metrics
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(102, 126, 234, 0.1)',
                              border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Consistency Rate
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                {personData.dailySteps?.length > 0 
                                  ? Math.round((personData.dailySteps.filter(steps => steps >= 10000).length / personData.dailySteps.length) * 100)
                                  : 0}%
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Best Week Avg
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                                {(() => {
                                  if (!personData.dailySteps?.length) return 0;
                                  let maxWeekAvg = 0;
                                  for (let i = 0; i <= personData.dailySteps.length - 7; i++) {
                                    const weekAvg = personData.dailySteps.slice(i, i + 7).reduce((sum, steps) => sum + steps, 0) / 7;
                                    maxWeekAvg = Math.max(maxWeekAvg, weekAvg);
                                  }
                                  return Math.round(maxWeekAvg);
                                })()}
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.2)'
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                Current Streak
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                                {personData.currentWinStreak || 0} days
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {tabValue === 4 && (
                  <Box>
                    <ComparisonTable 
                      currentPerson={name} 
                      currentPersonData={personData} 
                    />
                  </Box>
                )}
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>
    </Container>
  );
}