import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Alert, 
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  useTheme,
  Fade,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import { useStepsData } from '../hooks/useStepsData';
import StreakCard from '../components/StreakCard';
import MonthlyWinnersTable from '../components/MonthlyWinnersTable';
import AllTimeBestsTable from '../components/AllTimeBestsTable';
import CumulativeStepsChart from '../components/CumulativeStepsChart';
import WeeklyPerformanceChart from '../components/WeeklyPerformanceChart';
import ConsistencyHeatmap from '../components/ConsistencyHeatmap';
import Leaderboard from '../components/Leaderboard';
import DailyRankTable from '../components/DailyRankTable';
import BadgesSection from '../components/BadgesSection';
import { NAV_CONFIG, BREAKPOINTS } from '../constants';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getInitials } from '../utils/helpers';
import { calculateMonthlyWinners } from '../utils/analytics';
import { GamificationPageSkeleton } from '../components/LoadingSkeleton';

export default function GamificationPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);
  const { data: stepData, loading: stepLoading, error: stepError } = useStepsData();
  const { data: gamificationData, loading: gamificationLoading, error: gamificationError } = useStepsData({ gamification: true });

  const loading = stepLoading || gamificationLoading;
  const error = stepError || gamificationError;

  // Calculate proper monthly winners using calendar months
  const properMonthlyWinners = React.useMemo(() => {
    if (!stepData || !stepData.dailyData || !stepData.participants) {
      return [];
    }
    return calculateMonthlyWinners(stepData.dailyData, stepData.participants);
  }, [stepData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" disableGutters sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <GamificationPageSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" disableGutters sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Alert 
          severity="error" 
          sx={{ 
            mt: { xs: 2, sm: 3 }, 
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box className="gradient-primary-light rounded-lg p-4 mb-4" sx={{ 
            p: { xs: 3, sm: 4, md: 6 },
            mb: { xs: 3, sm: 4, md: 6 }
          }}>
            <Typography 
              variant="h2" 
              className="text-gradient-primary text-boldest mb-3"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem', lg: '3rem' },
                textAlign: 'center',
                mb: { xs: 2, sm: 3, md: 4 },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
              }}
            >
              🏆 Gamification Hub
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              className="text-center"
              sx={{ 
                maxWidth: 700, 
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }
              }}
            >
              Unlock achievements, earn badges, and compete with your step brothers!
            </Typography>
          </Box>

          {/* Navigation Tabs */}
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
              {NAV_CONFIG.TABS.map((tab) => (
                <Tab key={tab.value} label={tab.label} />
              ))}
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Fade in timeout={600}>
            <Box>
              {tabValue === 0 && (
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    🏆 Overall Leaderboard
                  </Typography>
                  <Leaderboard />
                  
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      mt: 6,
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    📊 Daily Performance Rankings
                  </Typography>
                  <DailyRankTable 
                    dailyData={stepData?.dailyData || []} 
                    participants={stepData?.participants || []} 
                  />
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    🔥 Win & Losing Streaks
                  </Typography>
                  {stepData && stepData.participantData && (
                    <Grid container spacing={{ xs: 0, sm: 4 }}>
                      {/* Win Streaks */}
                      <Grid xs={12}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.success.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          🔥 Current Win Streaks
                        </Typography>
                        <Grid container spacing={{ xs: 0, sm: 4 }}>
                          {stepData.participantData
                            .filter(p => p.currentWinStreak > 0)
                            .sort((a, b) => b.currentWinStreak - a.currentWinStreak)
                            .map(participant => (
                              <Grid xs={12} sm={6} md={4} key={`win-${participant.name}`} sx={{ mb: { xs: 2, sm: 0 } }}>
                                <StreakCard 
                                  participant={participant} 
                                  streakType="win" 
                                  streakCount={participant.currentWinStreak}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>

                      {/* Losing Streaks */}
                      <Grid xs={12} sx={{ mt: 6 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.error.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          📉 Current Losing Streaks
                        </Typography>
                        <Grid container spacing={{ xs: 0, sm: 4 }}>
                          {stepData.participantData
                            .filter(p => p.currentLosingStreak > 0)
                            .sort((a, b) => b.currentLosingStreak - a.currentLosingStreak)
                            .map(participant => (
                              <Grid xs={12} sm={6} md={4} key={`lose-${participant.name}`} sx={{ mb: { xs: 2, sm: 0 } }}>
                                <StreakCard 
                                  participant={participant} 
                                  streakType="lose" 
                                  streakCount={participant.currentLosingStreak}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>

                      {/* Best Win Streaks */}
                      <Grid xs={12} sx={{ mt: 6 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.warning.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          🏆 Best Win Streaks (All Time)
                        </Typography>
                        <Grid container spacing={{ xs: 0, sm: 4 }}>
                          {stepData.participantData
                            .filter(p => p.bestWinStreak > 0)
                            .sort((a, b) => b.bestWinStreak - a.bestWinStreak)
                            .map(participant => (
                              <Grid xs={12} sm={6} md={4} key={`best-${participant.name}`} sx={{ mb: { xs: 2, sm: 0 } }}>
                                <StreakCard 
                                  participant={participant} 
                                  streakType="best" 
                                  streakCount={participant.bestWinStreak}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
                    }}
                  >
                    📊 Progress Analytics
                  </Typography>
                  {gamificationData && stepData && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {/* Cumulative Steps Chart - Full Width */}
                      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          📈 Cumulative Steps Over Time
                        </Typography>
                        <Paper sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          borderRadius: 3, 
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <CumulativeStepsChart 
                            cumulativeData={gamificationData.cumulativeData} 
                            participants={stepData.participants}
                          />
                        </Paper>
                      </Box>

                      {/* Weekly Performance Chart - Full Width */}
                      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.info.main,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          📊 Weekly Performance Trends
                        </Typography>
                        <Paper sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          borderRadius: 3, 
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          height: { xs: 300, sm: 400 }
                        }}>
                          {stepData.participantData && stepData.participantData.length > 0 ? (
                            <WeeklyPerformanceChart 
                              dailySteps={stepData.participantData[0].dailySteps}
                            />
                          ) : (
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              height: '100%' 
                            }}>
                              <Typography variant="h6" color="text.secondary">
                                No weekly data available
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      </Box>

                      {/* Team Performance Distribution - Full Width */}
                      <Box>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.secondary.main,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          🏆 Team Performance Distribution
                        </Typography>
                        <Paper sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          borderRadius: 3, 
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {stepData.participants && stepData.participants.length > 0 ? (
                            <Box>
                              <Typography variant="h6" sx={{ 
                                textAlign: 'center', 
                                mb: 3, 
                                fontWeight: 600,
                                color: theme.palette.text.secondary
                              }}>
                                Performance Tiers Based on Average Daily Steps
                              </Typography>
                              
                              {/* Performance Tiers */}
                              <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, 
                                gap: 2,
                                mb: 4
                              }}>
                                {(() => {
                                  const participantStats = stepData.participants.map(participant => {
                                    const dailySteps = stepData.dailyData?.map(day => day.steps[participant] || 0).filter(steps => steps > 0) || [];
                                    const avgSteps = dailySteps.length > 0 ? dailySteps.reduce((sum, steps) => sum + steps, 0) / dailySteps.length : 0;
                                    
                                    return {
                                      name: participant,
                                      avgSteps,
                                      totalSteps: dailySteps.reduce((sum, steps) => sum + steps, 0),
                                      activeDays: dailySteps.length
                                    };
                                  }).sort((a, b) => b.avgSteps - a.avgSteps);

                                  const tiers = {
                                    elite: { min: 16000, color: '#10b981', label: 'Elite (16K+)', participants: [] },
                                    advanced: { min: 14000, color: '#3b82f6', label: 'Advanced (14K+)', participants: [] },
                                    intermediate: { min: 12000, color: '#f59e0b', label: 'Intermediate (12K+)', participants: [] },
                                    beginner: { min: 0, color: '#6b7280', label: 'Beginner (<12K)', participants: [] }
                                  };

                                  participantStats.forEach(participant => {
                                    if (participant.avgSteps >= 16000) {
                                      tiers.elite.participants.push(participant);
                                    } else if (participant.avgSteps >= 14000) {
                                      tiers.advanced.participants.push(participant);
                                    } else if (participant.avgSteps >= 12000) {
                                      tiers.intermediate.participants.push(participant);
                                    } else {
                                      tiers.beginner.participants.push(participant);
                                    }
                                  });

                                  return Object.entries(tiers).map(([key, tier]) => (
                                    <Box
                                      key={key}
                                      sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: `${tier.color}15`,
                                        border: `2px solid ${tier.color}40`,
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          transform: 'translateY(-2px)',
                                          boxShadow: `0 8px 25px ${tier.color}30`
                                        }
                                      }}
                                    >
                                      <Typography variant="h4" sx={{ 
                                        color: tier.color, 
                                        fontWeight: 800,
                                        mb: 1
                                      }}>
                                        {tier.participants.length}
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        mb: 1
                                      }}>
                                        {tier.label}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {tier.participants.length === 1 ? 'Participant' : 'Participants'}
                                      </Typography>
                                    </Box>
                                  ));
                                })()}
                              </Box>

                              {/* Individual Rankings */}
                              <Typography variant="h6" sx={{ 
                                textAlign: 'center', 
                                mb: 3, 
                                fontWeight: 600,
                                color: theme.palette.text.secondary
                              }}>
                                Individual Performance Rankings
                              </Typography>
                              
                              <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(300px, 1fr))' }, 
                                gap: 2,
                                mb: 3
                              }}>
                                {(() => {
                                  const participantStats = stepData.participants.map(participant => {
                                    const dailySteps = stepData.dailyData?.map(day => day.steps[participant] || 0).filter(steps => steps > 0) || [];
                                    const avgSteps = dailySteps.length > 0 ? dailySteps.reduce((sum, steps) => sum + steps, 0) / dailySteps.length : 0;
                                    
                                    return {
                                      name: participant,
                                      avgSteps,
                                      totalSteps: dailySteps.reduce((sum, steps) => sum + steps, 0),
                                      activeDays: dailySteps.length
                                    };
                                  }).sort((a, b) => b.avgSteps - a.avgSteps);

                                  return participantStats.map((participant, index) => {
                                    const getTierColor = (avgSteps) => {
                                      if (avgSteps >= 16000) return '#10b981';
                                      if (avgSteps >= 14000) return '#3b82f6';
                                      if (avgSteps >= 12000) return '#f59e0b';
                                      return '#6b7280';
                                    };

                                    const getTierLabel = (avgSteps) => {
                                      if (avgSteps >= 16000) return 'Elite';
                                      if (avgSteps >= 14000) return 'Advanced';
                                      if (avgSteps >= 12000) return 'Intermediate';
                                      return 'Beginner';
                                    };

                                    return (
                                      <Box
                                        key={participant.name}
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                          border: `2px solid ${getTierColor(participant.avgSteps)}40`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 2,
                                          transition: 'all 0.3s ease',
                                          '&:hover': {
                                            transform: 'translateX(4px)',
                                            boxShadow: `0 4px 15px ${getTierColor(participant.avgSteps)}30`
                                          }
                                        }}
                                      >
                                        <Box sx={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: '50%',
                                          backgroundColor: getTierColor(participant.avgSteps),
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'white',
                                          fontWeight: 700,
                                          fontSize: '1.1rem'
                                        }}>
                                          {index + 1}
                                        </Box>
                                        
                                        <Box sx={{ flex: 1 }}>
                                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {participant.name}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {getTierLabel(participant.avgSteps)} • {participant.activeDays} active days
                                          </Typography>
                                        </Box>
                                        
                                        <Box sx={{ textAlign: 'right' }}>
                                          <Typography variant="body2" sx={{ fontWeight: 700, color: getTierColor(participant.avgSteps) }}>
                                            {Math.round(participant.avgSteps).toLocaleString()}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            avg/day
                                          </Typography>
                                        </Box>
                                      </Box>
                                    );
                                  });
                                })()}
                              </Box>

                              {/* Team Stats */}
                              <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                gap: 2 
                              }}>
                                {(() => {
                                  const allDailySteps = stepData.dailyData?.flatMap(day => 
                                    Object.values(day.steps).filter(steps => steps > 0)
                                  ) || [];
                                  
                                  const teamAvgSteps = allDailySteps.length > 0 
                                    ? allDailySteps.reduce((sum, steps) => sum + steps, 0) / allDailySteps.length 
                                    : 0;
                                  
                                  const topPerformers = stepData.participants?.map(participant => {
                                    const dailySteps = stepData.dailyData?.map(day => day.steps[participant] || 0).filter(steps => steps > 0) || [];
                                    const avgSteps = dailySteps.length > 0 ? dailySteps.reduce((sum, steps) => sum + steps, 0) / dailySteps.length : 0;
                                    return { name: participant, avgSteps };
                                  }).sort((a, b) => b.avgSteps - a.avgSteps).slice(0, 3) || [];

                                  return (
                                    <>
                                      <Box sx={{ 
                                        textAlign: 'center', 
                                        p: 2, 
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                      }}>
                                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                                          {Math.round(teamAvgSteps).toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Team Average/Day
                                        </Typography>
                                      </Box>
                                      <Box sx={{ 
                                        textAlign: 'center', 
                                        p: 2, 
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                      }}>
                                        <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                                          {topPerformers[0]?.name || 'N/A'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Top Performer
                                        </Typography>
                                      </Box>
                                      <Box sx={{ 
                                        textAlign: 'center', 
                                        p: 2, 
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                        border: '1px solid rgba(245, 158, 11, 0.2)'
                                      }}>
                                        <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                                          {stepData.participants?.length || 0}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Total Participants
                                        </Typography>
                                      </Box>
                                    </>
                                  );
                                })()}
                              </Box>
                            </Box>
                          ) : (
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              height: '200px' 
                            }}>
                              <Typography variant="h6" color="text.secondary">
                                No performance data available
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      </Box>

                      {/* Daily Averages - Full Width */}
                      <Box>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.success.main,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          📊 Daily Averages
                        </Typography>
                        <Paper sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          borderRadius: 3, 
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                          }
                        }}>
                          <Grid container spacing={3}>
                            {stepData.participantData && stepData.participantData
                              .sort((a, b) => (b.averageSteps || 0) - (a.averageSteps || 0))
                              .map((participant, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={participant.name}>
                                  <Box 
                                    className="performance-card"
                                    sx={{
                                      p: 3,
                                      borderRadius: 3,
                                      background: `linear-gradient(135deg, rgba(16, 185, 129, ${0.08 + index * 0.02}) 0%, rgba(16, 185, 129, ${0.04 + index * 0.01}) 100%)`,
                                      border: `2px solid rgba(16, 185, 129, ${0.2 + index * 0.05})`,
                                      cursor: 'pointer',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: `linear-gradient(90deg, rgba(16, 185, 129, 0.8) 0%, rgba(16, 185, 129, 0.4) 100%)`,
                                        borderRadius: '3px 3px 0 0'
                                      }
                                    }}
                                  >
                                    {/* Rank Badge */}
                                    <Box 
                                      className="rank-badge"
                                      sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(16, 185, 129, 0.7) 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '1rem'
                                      }}
                                    >
                                      #{index + 1}
                                    </Box>

                                    {/* Participant Name */}
                                    <Typography variant="h6" sx={{ 
                                      fontWeight: 700,
                                      color: theme.palette.text.primary,
                                      mb: 2,
                                      pr: 5
                                    }}>
                                      {participant.name}
                                    </Typography>

                                    {/* Average Steps */}
                                    <Typography variant="h3" sx={{ 
                                      fontWeight: 800,
                                      color: theme.palette.success.main,
                                      mb: 1,
                                      textAlign: 'center',
                                      fontSize: { xs: '1.5rem', sm: '2rem' }
                                    }}>
                                      {Math.round(participant.averageSteps || 0).toLocaleString()}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ 
                                      color: theme.palette.text.secondary,
                                      textAlign: 'center',
                                      fontWeight: 500,
                                      mb: 2
                                    }}>
                                      average steps/day
                                    </Typography>

                                    {/* Performance Indicator */}
                                    <Box sx={{ 
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 1
                                    }}>
                                      <Box sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        background: theme.palette.success.main,
                                        animation: 'pulse 2s infinite'
                                      }} />
                                      <Typography variant="caption" sx={{ 
                                        color: theme.palette.success.main,
                                        fontWeight: 600
                                      }}>
                                        Active
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                        </Paper>
                      </Box>

                      {/* Consistency Stats - Full Width */}
                      <Box>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 3, 
                            fontWeight: 700, 
                            color: theme.palette.warning.main,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          🔥 Consistency Stats
                        </Typography>
                        <Paper sx={{ 
                          p: { xs: 2, sm: 3 }, 
                          borderRadius: 3, 
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                          }
                        }}>
                          <Grid container spacing={3}>
                            {stepData.participantData && stepData.participantData
                              .map((participant, index) => {
                                const consistencyRate = participant.dailySteps && participant.dailySteps.length > 0 
                                  ? Math.round((participant.dailySteps.filter(steps => steps >= 10000).length / participant.dailySteps.length) * 100)
                                  : 0;
                                
                                const activeDays = participant.dailySteps ? participant.dailySteps.filter(steps => steps > 0).length : 0;
                                const totalDays = participant.dailySteps ? participant.dailySteps.length : 0;
                                
                                const getConsistencyColor = (rate) => {
                                  if (rate >= 80) return '#10b981'; // Green
                                  if (rate >= 60) return '#3b82f6'; // Blue
                                  if (rate >= 40) return '#f59e0b'; // Orange
                                  return '#ef4444'; // Red
                                };

                                const getConsistencyLabel = (rate) => {
                                  if (rate >= 80) return 'Excellent';
                                  if (rate >= 60) return 'Good';
                                  if (rate >= 40) return 'Fair';
                                  return 'Needs Work';
                                };

                                return (
                                  <Grid item xs={12} sm={6} md={4} lg={3} key={participant.name}>
                                    <Box 
                                      className="consistency-card"
                                      sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, rgba(245, 158, 11, ${0.08 + index * 0.02}) 0%, rgba(245, 158, 11, ${0.04 + index * 0.01}) 100%)`,
                                        border: `2px solid rgba(245, 158, 11, ${0.2 + index * 0.05})`,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                          content: '""',
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          height: '4px',
                                          background: `linear-gradient(90deg, ${getConsistencyColor(consistencyRate)} 0%, ${getConsistencyColor(consistencyRate)}80 100%)`,
                                          borderRadius: '3px 3px 0 0'
                                        }
                                      }}
                                    >
                                      {/* Consistency Badge */}
                                      <Box 
                                        className="consistency-badge"
                                        sx={{
                                          position: 'absolute',
                                          top: 12,
                                          right: 12,
                                          px: 2,
                                          py: 0.5,
                                          borderRadius: 2,
                                          background: `${getConsistencyColor(consistencyRate)}20`,
                                          border: `1px solid ${getConsistencyColor(consistencyRate)}40`
                                        }}
                                      >
                                        <Typography variant="caption" sx={{ 
                                          color: getConsistencyColor(consistencyRate),
                                          fontWeight: 700,
                                          fontSize: '0.75rem'
                                        }}>
                                          {getConsistencyLabel(consistencyRate)}
                                        </Typography>
                                      </Box>

                                      {/* Participant Name */}
                                      <Typography variant="h6" sx={{ 
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        mb: 2,
                                        pr: 8
                                      }}>
                                        {participant.name}
                                      </Typography>

                                      {/* Consistency Rate */}
                                      <Typography variant="h3" sx={{ 
                                        fontWeight: 800,
                                        color: getConsistencyColor(consistencyRate),
                                        mb: 1,
                                        textAlign: 'center',
                                        fontSize: { xs: '1.5rem', sm: '2rem' }
                                      }}>
                                        {consistencyRate}%
                                      </Typography>
                                      
                                      <Typography variant="body2" sx={{ 
                                        color: theme.palette.text.secondary,
                                        textAlign: 'center',
                                        fontWeight: 500,
                                        mb: 3
                                      }}>
                                        10K+ consistency
                                      </Typography>

                                      {/* Progress Bar */}
                                      <Box sx={{ mb: 3 }}>
                                        <Box sx={{
                                          width: '100%',
                                          height: 10,
                                          background: 'rgba(0, 0, 0, 0.1)',
                                          borderRadius: 5,
                                          overflow: 'hidden'
                                        }}>
                                          <Box 
                                            className="progress-bar-animated"
                                            sx={{
                                              width: `${consistencyRate}%`,
                                              height: '100%',
                                              background: `linear-gradient(90deg, ${getConsistencyColor(consistencyRate)} 0%, ${getConsistencyColor(consistencyRate)}80 100%)`,
                                              borderRadius: 5,
                                              transition: 'width 0.8s ease',
                                              '--progress-width': `${consistencyRate}%`
                                            }}
                                          />
                                        </Box>
                                      </Box>

                                      {/* Activity Stats */}
                                      <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}>
                                        <Typography variant="caption" color="text.secondary">
                                          Active: {activeDays}/{totalDays}
                                        </Typography>
                                        <Typography variant="caption" sx={{ 
                                          color: getConsistencyColor(consistencyRate),
                                          fontWeight: 600
                                        }}>
                                          {Math.round((activeDays / totalDays) * 100)}% active
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </Paper>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 3 && (
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    ⭐ All-Time Best Performances
                  </Typography>
                  {gamificationData && (
                    <AllTimeBestsTable allTimeBests={gamificationData.allTimeBests} />
                  )}
                  
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      mt: 6,
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    🏅 Monthly Champions
                  </Typography>
                  {gamificationData && (
                    <MonthlyWinnersTable monthlyWinners={properMonthlyWinners} />
                  )}
                </Box>
              )}

              {tabValue === 4 && (
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    🏅 Badges & Achievements
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ mb: 4 }}
                  >
                    Fun achievements for the friend group - only one person can earn each badge!
                  </Typography>
                  {stepData && stepData.participantData && (
                    <BadgesSection 
                      participantData={stepData.participantData[0]} 
                      allParticipants={stepData.participantData}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        </Box>
      </Fade>
    </Container>
  );
} 