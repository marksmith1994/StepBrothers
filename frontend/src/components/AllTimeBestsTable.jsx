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
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function AllTimeBestsTable({ allTimeBests, monthlyBests, yearlyLeaders }) {
  const theme = useTheme();

  if (!allTimeBests || allTimeBests.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No all-time bests data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Best Month Section */}
      {monthlyBests && monthlyBests.length > 0 && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Best Month Performance
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {monthlyBests.slice(0, 6).map((best, index) => (
              <Grid item xs={12} sm={6} md={4} key={`monthly-${best.participant}-${best.month}`}>
                <Card sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: index === 0 ? '2px solid #FFD700' : '1px solid rgba(0,0,0,0.1)',
                  bgcolor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: index === 0 ? '#FFD700' : theme.palette.primary.light,
                      color: index === 0 ? '#000' : theme.palette.primary.contrastText,
                      fontSize: 14
                    }}>
                      {getInitials(best.participant)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                      {best.participant}
                    </Typography>
                    {index === 0 && <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {best.steps.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {best.month}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Leading for the Year Section */}
      {yearlyLeaders && yearlyLeaders.length > 0 && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <TrendingUpIcon sx={{ color: '#10b981', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Leading for the Year
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {yearlyLeaders.slice(0, 6).map((leader, index) => (
              <Grid item xs={12} sm={6} md={4} key={`yearly-${leader.participant}`}>
                <Card sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: index === 0 ? '2px solid #10b981' : '1px solid rgba(0,0,0,0.1)',
                  bgcolor: index === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: index === 0 ? '#10b981' : theme.palette.primary.light,
                      color: index === 0 ? '#fff' : theme.palette.primary.contrastText,
                      fontSize: 14
                    }}>
                      {getInitials(leader.participant)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                      {leader.participant}
                    </Typography>
                    {index === 0 && <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16 }} />}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {leader.totalSteps.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Steps This Year
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* All-Time Best Single Day */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <StarIcon sx={{ color: '#FFD700', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            All-Time Best Single Day
          </Typography>
        </Box>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Player</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Steps</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Day</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTimeBests.map((best, index) => (
              <TableRow
                key={`${best.participant}-${best.day}`}
                sx={{
                  background: index === 0 ? theme.palette.action.hover : 'inherit',
                  '&:hover': { background: theme.palette.action.hover }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {index < 3 ? (
                      <StarIcon sx={{ 
                        color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                        fontSize: 20 
                      }} />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        #{index + 1}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: { xs: 28, sm: 36 }, 
                        height: { xs: 28, sm: 36 }, 
                        bgcolor: index === 0 ? '#FFD700' : theme.palette.primary.light,
                        color: index === 0 ? '#000' : theme.palette.primary.contrastText,
                        fontWeight: 700,
                        fontSize: { xs: 12, sm: 16 }
                      }}
                    >
                      {getInitials(best.participant)}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {best.participant}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" sx={{ fontWeight: 600, color: index === 0 ? '#FFD700' : 'inherit' }}>
                    {best.steps.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="textSecondary">
                    {best.date}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
} 