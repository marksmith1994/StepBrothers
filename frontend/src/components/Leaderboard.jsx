import React from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, useTheme } from '@mui/material';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { useStepsData } from '../hooks/useStepsData';

const medals = [
  { icon: <EmojiEvents sx={{ color: '#FFD700' }} />, label: 'Gold' },
  { icon: <EmojiEvents sx={{ color: '#C0C0C0' }} />, label: 'Silver' },
  { icon: <EmojiEvents sx={{ color: '#CD7F32' }} />, label: 'Bronze' }
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function Leaderboard({ tab = 'dashboard' }) {
  const { data: stepData } = useStepsData({ tab });
  const theme = useTheme();

  // Get totals from participant data
  let totals = {};
  if (stepData && stepData.participantData) {
    stepData.participantData.forEach(participant => {
      totals[participant.name] = participant.totalSteps;
    });
  }

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  return (
    <Paper sx={{ 
      mt: { xs: 2, sm: 4 }, 
      p: { xs: 1.5, sm: 3 }, 
      borderRadius: 3, 
      boxShadow: 3, 
      overflowX: 'auto',
      '@media (max-width: 600px)': {
        mt: 1,
        p: 1,
        borderRadius: 2
      }
    }}>
      <Typography variant="h5" sx={{ 
        mb: { xs: 1.5, sm: 2 }, 
        fontWeight: 800, 
        letterSpacing: 1,
        fontSize: { xs: '1.25rem', sm: '1.5rem' }
      }}>
        Leaderboard
      </Typography>
      <Table size="small" sx={{ 
        '@media (max-width: 600px)': {
          fontSize: '0.75rem'
        }
      }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Rank
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              User
            </TableCell>
            <TableCell align="right" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '8px 4px', sm: '16px' }
            }}>
              Steps
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map(([person, steps], idx) => (
            <TableRow
              key={person}
              sx={idx === 0 ? { background: theme.palette.action.hover, boxShadow: 1 } : {}}
            >
              <TableCell sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '8px 4px', sm: '16px' }
              }}>
                {idx < 3 ? medals[idx].icon : idx + 1}
              </TableCell>
              <TableCell sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '8px 4px', sm: '16px' }
              }}>
                <Avatar sx={{ 
                  width: { xs: 24, sm: 32 }, 
                  height: { xs: 24, sm: 32 }, 
                  bgcolor: theme.palette.primary.light, 
                  color: theme.palette.primary.contrastText, 
                  fontWeight: 700, 
                  fontSize: { xs: 14, sm: 18 }
                }}>
                  {getInitials(person)}
                </Avatar>
                <span style={{ 
                  fontWeight: idx === 0 ? 700 : 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  {person.charAt(0).toUpperCase() + person.slice(1)}
                </span>
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: idx === 0 ? 700 : 400, 
                fontSize: { xs: '0.75rem', sm: '1.1rem' },
                padding: { xs: '8px 4px', sm: '16px' }
              }}>
                {typeof steps === 'number' ? steps.toLocaleString() : (Number(steps?.toString().replace(/,/g, '')) || '')?.toLocaleString?.() || steps}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
} 