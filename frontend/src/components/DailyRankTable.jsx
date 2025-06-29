import React from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Avatar, 
  Box,
  useTheme,
  Chip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getInitials } from '../utils/helpers';

export default function DailyRankTable({ dailyData, participants }) {
  const theme = useTheme();

  if (!dailyData || !participants || dailyData.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No daily rank data available
        </Typography>
      </Paper>
    );
  }

  // Calculate daily rankings for each participant
  const calculateDailyRanks = () => {
    const rankCounts = {};
    
    // Initialize rank counts for each participant
    participants.forEach(participant => {
      rankCounts[participant] = {};
      // Initialize for positions 1-10 (or however many participants there are)
      for (let i = 1; i <= participants.length; i++) {
        rankCounts[participant][i] = 0;
      }
    });

    // Calculate rankings for each day
    dailyData.forEach(dayEntry => {
      if (!dayEntry.steps) return;

      // Get all participants with their steps for this day
      const dayResults = participants.map(participant => ({
        name: participant,
        steps: dayEntry.steps[participant] || 0
      }));

      // Sort by steps (descending) to get rankings
      dayResults.sort((a, b) => b.steps - a.steps);

      // Count ranks (handle ties by giving same rank)
      let currentRank = 1;
      let currentSteps = dayResults[0]?.steps;
      
      dayResults.forEach((result, index) => {
        if (result.steps < currentSteps) {
          currentRank = index + 1;
          currentSteps = result.steps;
        }
        
        if (rankCounts[result.name] && rankCounts[result.name][currentRank] !== undefined) {
          rankCounts[result.name][currentRank]++;
        }
      });
    });

    return rankCounts;
  };

  const rankCounts = calculateDailyRanks();

  // Calculate total wins and average rank for each participant
  const participantStats = participants.map(participant => {
    const wins = rankCounts[participant][1] || 0;
    const totalDays = dailyData.length;
    const winRate = totalDays > 0 ? ((wins / totalDays) * 100).toFixed(1) : 0;
    
    // Calculate average rank
    let totalRankPoints = 0;
    let totalDaysWithData = 0;
    for (let rank = 1; rank <= participants.length; rank++) {
      const count = rankCounts[participant][rank] || 0;
      totalRankPoints += count * rank;
      totalDaysWithData += count;
    }
    const averageRank = totalDaysWithData > 0 ? (totalRankPoints / totalDaysWithData).toFixed(1) : '-';

    return {
      name: participant,
      wins,
      winRate,
      averageRank,
      rankCounts: rankCounts[participant]
    };
  });

  // Sort by wins (descending), then by average rank
  participantStats.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return parseFloat(a.averageRank) - parseFloat(b.averageRank);
  });

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return theme.palette.text.secondary;
    }
  };

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      borderRadius: 3, 
      boxShadow: 3,
      overflowX: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, sm: 3 } }}>
        <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: { xs: 24, sm: 28 } }} />
        <Typography variant="h5" sx={{ 
          fontWeight: 800, 
          letterSpacing: 1,
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Daily Rankings
        </Typography>
      </Box>
      
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Participant
            </TableCell>
            <TableCell align="center" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              🥇 1st
            </TableCell>
            <TableCell align="center" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              🥈 2nd
            </TableCell>
            <TableCell align="center" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              🥉 3rd
            </TableCell>
            {participants.length > 3 && (
              <TableCell align="center" sx={{ 
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '8px 4px', sm: '16px' }
              }}>
                4th+
              </TableCell>
            )}
            <TableCell align="center" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Win Rate
            </TableCell>
            <TableCell align="center" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Avg Rank
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participantStats.map((participant, index) => {
            const isTop3 = index < 3;
            return (
              <TableRow
                key={participant.name}
                sx={{
                  '&:hover': { background: theme.palette.action.hover },
                  ...(isTop3 && {
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.04) 100%)',
                    }
                  })
                }}
              >
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Avatar 
                      sx={{ 
                        width: { xs: 28, sm: 36 }, 
                        height: { xs: 28, sm: 36 }, 
                        bgcolor: isTop3 ? '#FFD700' : theme.palette.primary.light,
                        color: isTop3 ? '#000' : theme.palette.primary.contrastText,
                        fontWeight: 700,
                        fontSize: { xs: 12, sm: 16 },
                        border: isTop3 ? '2px solid #FFD700' : 'none'
                      }}
                    >
                      {getInitials(participant.name)}
                    </Avatar>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      {participant.name}
                    </Typography>
                    {isTop3 && (
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          bgcolor: getRankColor(index + 1),
                          color: '#000',
                          fontWeight: 700,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' },
                  color: '#FFD700',
                  fontWeight: 600
                }}>
                  {participant.rankCounts[1] || 0}
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' },
                  color: '#C0C0C0',
                  fontWeight: 600
                }}>
                  {participant.rankCounts[2] || 0}
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' },
                  color: '#CD7F32',
                  fontWeight: 600
                }}>
                  {participant.rankCounts[3] || 0}
                </TableCell>
                {participants.length > 3 && (
                  <TableCell align="center" sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '8px 4px', sm: '16px' }
                  }}>
                    {Object.entries(participant.rankCounts)
                      .filter(([rank]) => parseInt(rank) > 3)
                      .reduce((sum, [, count]) => sum + count, 0)}
                  </TableCell>
                )}
                <TableCell align="center" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>
                  <Typography variant="body2" sx={{ 
                    color: participant.winRate > 50 ? '#10b981' : 'inherit',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    {participant.winRate}%
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    {participant.averageRank}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
} 