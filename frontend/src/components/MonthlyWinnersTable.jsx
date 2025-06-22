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
  useTheme 
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function MonthlyWinnersTable({ monthlyWinners }) {
  const theme = useTheme();

  if (!monthlyWinners || monthlyWinners.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No monthly champions data available
        </Typography>
      </Paper>
    );
  }

  // Find the best month (highest steps)
  const bestMonth = monthlyWinners.reduce((best, current) => 
    current.steps > best.steps ? current : best, monthlyWinners[0]
  );

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
          Monthly Champions
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
              Month
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Champion
            </TableCell>
            <TableCell align="right" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Steps
            </TableCell>
            <TableCell align="right" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Days
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {monthlyWinners.map((winner) => {
            const isBestMonth = winner.steps === bestMonth.steps;
            return (
              <TableRow
                key={winner.month}
                sx={{
                  '&:hover': { background: theme.palette.action.hover },
                  ...(isBestMonth && {
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
                    border: '2px solid #FFD700',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)',
                    }
                  })
                }}
              >
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    {winner.month}
                    {isBestMonth && (
                      <Box component="span" sx={{ ml: 1, color: '#FFD700' }}>
                        🏆
                      </Box>
                    )}
                  </Typography>
                </TableCell>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Avatar 
                      sx={{ 
                        width: { xs: 28, sm: 36 }, 
                        height: { xs: 28, sm: 36 }, 
                        bgcolor: isBestMonth ? '#FFD700' : theme.palette.primary.light,
                        color: isBestMonth ? '#000' : theme.palette.primary.contrastText,
                        fontWeight: 700,
                        fontSize: { xs: 12, sm: 16 },
                        border: isBestMonth ? '2px solid #FFD700' : 'none'
                      }}
                    >
                      {getInitials(winner.winner)}
                    </Avatar>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      {winner.winner}
                    </Typography>
                    <EmojiEventsIcon sx={{ 
                      color: isBestMonth ? '#FFD700' : '#FFD700', 
                      fontSize: isBestMonth ? { xs: 20, sm: 24 } : { xs: 16, sm: 20 },
                      filter: isBestMonth ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' : 'none'
                    }} />
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 600,
                    color: isBestMonth ? '#FFD700' : 'inherit',
                    textShadow: isBestMonth ? '0 0 4px rgba(255, 215, 0, 0.3)' : 'none',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    {winner.steps.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>
                  <Typography variant="body2" color="textSecondary" sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    {winner.daysInMonth}
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