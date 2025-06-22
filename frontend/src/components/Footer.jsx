import React from 'react';
import { Box, Typography, Container, Link, Chip, useTheme } from '@mui/material';
import { useCacheStats } from '../hooks/useStepsData';

export default function Footer() {
  const theme = useTheme();
  const stats = useCacheStats();

  const getCacheStatus = () => {
    if (!stats || stats.size === 0) return { color: 'default', label: 'No cache' };
    if (stats.size < 5) return { color: 'success', label: 'Light cache' };
    if (stats.size < 10) return { color: 'warning', label: 'Moderate cache' };
    return { color: 'info', label: 'Heavy cache' };
  };

  const cacheStatus = getCacheStatus();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 2 },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 2, sm: 2 }
          }}
        >
          {/* Left side - App info */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: theme.palette.primary.main, 
              mb: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              🏃‍♂️ Step Brothers
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              mb: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}>
              Track your daily steps and compete with friends
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: { xs: '0.625rem', sm: '0.75rem' }
            }}>
              © 2024 Step Brothers. All rights reserved.
            </Typography>
          </Box>

          {/* Center - Cache status */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ 
              mb: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}>
              Cache Status
            </Typography>
            <Chip
              label={`${cacheStatus.label} (${stats?.size || 0} items)`}
              color={cacheStatus.color}
              size="small"
              variant="outlined"
              sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
            />
          </Box>

          {/* Right side - Links */}
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="body2" color="text.secondary" sx={{ 
              mb: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Dashboard
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Gamification
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Analytics
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 