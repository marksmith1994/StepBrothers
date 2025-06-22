import React from "react";
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Alert, 
  Button, 
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import PersonPageSkeleton from '../components/PersonPageSkeleton';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { getInitials, formatNumber, formatSteps } from '../utils/helpers';
import { STREAK_CONFIG } from '../constants';
import { calculateAchievements, getAchievementStats } from '../utils/achievements';
import { calculatePersonalAnalytics } from '../utils/analytics';
import AchievementCard from '../components/AchievementCard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function PersonPage() {
  const theme = useTheme();
  const { name } = useParams();
  const navigate = useNavigate();
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
    <Card className="stat-card">
      <CardContent className="text-center p-3">
        <Box className="flex-center mb-2">
          {React.cloneElement(icon, { 
            sx: { 
              color: color, 
              fontSize: 48,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            } 
          })}
        </Box>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900, 
            color: color,
            mb: 1,
            textShadow: `0 2px 8px ${color}30`
          }}
        >
          {formatNumber(value)}
        </Typography>
        <Typography 
          variant="h6" 
          className="text-bold"
          sx={{ 
            color: theme.palette.text.primary,
            mb: subtitle ? 0.5 : 0
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            className="text-bold"
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box className="mb-4" sx={{ mb: { xs: 3, sm: 4 } }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/')}
              className="btn-glass mb-3"
              sx={{ 
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Back to Dashboard
            </Button>
            
            <Box className="gradient-primary-light rounded-lg p-4 mb-3" sx={{ 
              p: { xs: 3, sm: 4 },
              mb: { xs: 2, sm: 3 }
            }}>
              <Box className="flex" sx={{ 
                alignItems: 'center', 
                gap: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Avatar 
                  className="avatar-gradient"
                  sx={{ 
                    width: { xs: 60, sm: 80 }, 
                    height: { xs: 60, sm: 80 }, 
                    fontSize: { xs: 24, sm: 32 },
                    fontWeight: 700
                  }}
                >
                  {getInitials(name)}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h2" 
                    className="text-gradient-primary text-boldest mb-1"
                    sx={{ 
                      fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                      mb: { xs: 0.5, sm: 1 }
                    }}
                  >
                    {name}
                  </Typography>
                  <Chip
                    label="Step Brother"
                    className="chip-gradient"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' } }}
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
                <Paper className="paper-glass mb-4">
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons={false}
                    sx={{
                      '& .MuiTab-root': {
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        minHeight: { xs: 48, sm: 56 }
                      },
                      '& .MuiTabs-indicator': {
                        height: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }
                    }}
                  >
                    <Tab label="📊 Overview" />
                    <Tab label="🏆 Achievements" />
                    <Tab label="📈 Analytics" />
                    <Tab label="📋 Progress" />
                  </Tabs>
                </Paper>

                {/* Tab Content */}
                {tabValue === 0 && (
                  <Box>
                    {/* Basic Stats */}
                    <Typography 
                      variant="h3" 
                      className="text-gradient-primary text-bolder mb-3"
                    >
                      📊 Basic Statistics
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        {getStatCard(
                          'Total Steps',
                          personData.totalSteps || 0,
                          <StarIcon />,
                          theme.palette.primary.main,
                          'All time'
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        {getStatCard(
                          'Average Steps/Day',
                          Math.round(personData.averageSteps || 0),
                          <TrendingDownIcon />,
                          theme.palette.success.main,
                          'Daily average'
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        {getStatCard(
                          'Days Tracked',
                          personData.dailySteps?.length || 0,
                          <EmojiEventsIcon />,
                          theme.palette.info.main,
                          'Total days'
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        {getStatCard(
                          'Highest Single Day',
                          personData.highestSingleDay || 0,
                          <LocalFireDepartmentIcon />,
                          theme.palette.warning.main,
                          'Best performance'
                        )}
                      </Grid>
                    </Grid>

                    {/* Gamification Stats */}
                    <Paper className="paper-gradient p-4 mb-6">
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          mb: 4, 
                          fontWeight: 800, 
                          color: 'white',
                          textAlign: 'center'
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
                      className="text-gradient-primary text-bolder mb-3"
                    >
                      🏆 Achievements
                    </Typography>

                    {/* Achievement Stats */}
                    <Paper className="paper-glass p-3 mb-4">
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.success.main }}>
                            {achievementStats.earned}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Achievements Earned
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                            {achievementStats.completionRate}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Completion Rate
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.warning.main }}>
                            {achievementStats.progress}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            In Progress
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.info.main }}>
                            {achievementStats.total}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Available
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Earned Achievements */}
                    {achievements.earned.length > 0 && (
                      <>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700,
                            color: theme.palette.success.main
                          }}
                        >
                          ✅ Earned Achievements
                        </Typography>
                        
                        {/* Earned Achievement Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                          {achievements.earned.map((achievement, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                              <AchievementCard 
                                achievement={achievement} 
                                isEarned={true}
                                showProgress={false}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    )}
                    
                    {/* Progress Achievements */}
                    {achievements.progress.length > 0 && (
                      <>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700,
                            color: theme.palette.primary.main
                          }}
                        >
                          🎯 In Progress
                        </Typography>

                        {/* Step Milestone Achievements */}
                        {achievements.progress.filter(a => a.type === 'step_milestone').length > 0 && (
                          <>
                            <Typography variant="h6" className="text-bold mb-2" color="text.secondary">
                              Step Milestones
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                              {achievements.progress.filter(a => a.type === 'step_milestone').map((achievement, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                  <AchievementCard 
                                    achievement={achievement} 
                                    isEarned={false}
                                    showProgress={true}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        )}

                        {/* Consistency Achievements */}
                        {achievements.progress.filter(a => a.type === 'consistency').length > 0 && (
                          <>
                            <Typography variant="h6" className="text-bold mb-2" color="text.secondary">
                              10K+ Consistency
                            </Typography>
                            <Grid container spacing={3}>
                              {achievements.progress.filter(a => a.type === 'consistency').map((achievement, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                  <AchievementCard 
                                    achievement={achievement} 
                                    isEarned={false}
                                    showProgress={true}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        )}
                      </>
                    )}
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    {/* Analytics Dashboard */}
                    <Typography 
                      variant="h3" 
                      className="text-gradient-primary text-bolder mb-3"
                    >
                      📊 Analytics
                    </Typography>
                    <Box className="paper-glass p-4">
                      <AnalyticsDashboard analytics={analytics} />
                    </Box>
                  </Box>
                )}

                {tabValue === 3 && (
                  <Box>
                    {/* Progress Overview */}
                    <Typography 
                      variant="h3" 
                      className="text-gradient-primary text-bolder mb-4"
                    >
                      📈 Progress Tracking
                    </Typography>

                    {/* Progress Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card" sx={{ 
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.2)'
                        }}>
                          <CardContent className="text-center p-3">
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.primary.main,
                              mb: 1
                            }}>
                              {personData.dailySteps?.length || 0}
                            </Typography>
                            <Typography variant="body1" className="text-bold">
                              Days Tracked
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card" sx={{ 
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          <CardContent className="text-center p-3">
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.success.main,
                              mb: 1
                            }}>
                              {Math.round(personData.averageSteps || 0)}
                            </Typography>
                            <Typography variant="body1" className="text-bold">
                              Avg Steps/Day
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card" sx={{ 
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.2)'
                        }}>
                          <CardContent className="text-center p-3">
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.warning.main,
                              mb: 1
                            }}>
                              {personData.highestSingleDay || 0}
                            </Typography>
                            <Typography variant="body1" className="text-bold">
                              Best Single Day
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card" sx={{ 
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}>
                          <CardContent className="text-center p-3">
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900, 
                              color: theme.palette.secondary.main,
                              mb: 1
                            }}>
                              {personData.totalSteps || 0}
                            </Typography>
                            <Typography variant="body1" className="text-bold">
                              Total Steps
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Main Progress Chart */}
                    <Paper className="paper-glass" sx={{ 
                      p: { xs: 2, sm: 3, md: 4 }, 
                      mb: 4,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          mb: 3, 
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          textAlign: 'center'
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

                    {/* Progress Insights */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper className="paper-glass" sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 3, 
                              fontWeight: 700,
                              color: theme.palette.primary.main
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
                              <Typography variant="body1" className="text-bold">
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
                              <Typography variant="body1" className="text-bold">
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
                              <Typography variant="body1" className="text-bold">
                                Days Above 20K
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                                {personData.dailySteps?.filter(steps => steps >= 20000).length || 0}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper className="paper-glass" sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          height: '100%',
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 3, 
                              fontWeight: 700,
                              color: theme.palette.primary.main
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
                              <Typography variant="body1" className="text-bold">
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
                              <Typography variant="body1" className="text-bold">
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
                              <Typography variant="body1" className="text-bold">
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
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>
    </Container>
  );
}
