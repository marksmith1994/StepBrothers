import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, useTheme, Chip } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getInitials, getStreakColor, getStreakText } from '../utils/helpers';
import { STREAK_CONFIG } from '../constants';

export default function StreakCard({ participant, isWinStreak = true }) {
  const theme = useTheme();
  const streak = isWinStreak ? participant.currentWinStreak : participant.currentLosingStreak;
  const bestStreak = isWinStreak ? participant.bestWinStreak : 0;
  
  const streakColor = isWinStreak ? '#10b981' : getStreakColor('lose', streak);
  const streakText = getStreakText(isWinStreak, streak);

  const getStreakIcon = () => {
    if (isWinStreak) {
      if (streak >= STREAK_CONFIG.GOLD_THRESHOLD) {
        return <EmojiEventsIcon sx={{ color: STREAK_CONFIG.COLORS.GOLD, fontSize: 28 }} />;
      }
      return <LocalFireDepartmentIcon sx={{ color: '#10b981', fontSize: 28 }} />;
    } else {
      return <TrendingDownIcon sx={{ color: streakColor, fontSize: 28 }} />;
    }
  };

  const getCardBackground = () => {
    if (isWinStreak) {
      if (streak >= STREAK_CONFIG.GOLD_THRESHOLD) {
        return 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)';
      }
      return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)';
    } else {
      return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)';
    }
  };

  return (
    <Card 
      sx={{ 
        minWidth: { xs: 250, sm: 280 },
        height: '100%',
        background: getCardBackground(),
        border: `2px solid ${streakColor}`,
        borderRadius: 3,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: `0 12px 40px ${streakColor}30`,
          borderColor: streakColor,
          '& .streak-number': {
            transform: 'scale(1.1)',
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${streakColor} 0%, ${streakColor}80 100%)`,
          borderRadius: '12px 12px 0 0'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header with Avatar and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
          <Avatar 
            sx={{ 
              width: { xs: 48, sm: 56 }, 
              height: { xs: 48, sm: 56 }, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: 18, sm: 22 },
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            {getInitials(participant.name)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                color: theme.palette.text.primary,
                mb: 0.5,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {participant.name}
            </Typography>
            <Chip
              label={isWinStreak ? '🔥 Win Streak' : '📉 Losing Streak'}
              size="small"
              sx={{
                background: isWinStreak 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24
              }}
            />
          </Box>
        </Box>
        
        {/* Streak Number and Icon */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 2, 
          mb: 2,
          p: 2,
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {getStreakIcon()}
          <Typography 
            variant="h2" 
            className="streak-number"
            sx={{ 
              fontWeight: 900, 
              color: streakColor,
              transition: 'transform 0.3s ease',
              textShadow: `0 2px 8px ${streakColor}40`
            }}
          >
            {streak}
          </Typography>
        </Box>
        
        {/* Streak Description */}
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: 2
          }}
        >
          {streakText}
        </Typography>
        
        {/* Best Streak Info */}
        {isWinStreak && bestStreak > 0 && bestStreak !== streak && (
          <Box sx={{ 
            textAlign: 'center',
            p: 1.5,
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: STREAK_CONFIG.COLORS.GOLD,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 16 }} />
              Best: {bestStreak} days
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 