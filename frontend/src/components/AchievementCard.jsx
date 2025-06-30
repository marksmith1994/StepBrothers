import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress,
  Chip,
  useTheme
} from '@mui/material';
import { formatNumber } from '../utils/helpers';

export default function AchievementCard({ achievement, isEarned = false, showProgress = true }) {
  const theme = useTheme();

  const getProgressColor = () => {
    if (isEarned) return theme.palette.success.main;
    if (achievement.progress >= 80) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  const getStatusText = () => {
    if (isEarned) return 'Earned!';
    if (achievement.progress >= 80) return 'Almost there!';
    if (achievement.progress >= 50) return 'Halfway!';
    return 'In progress';
  };

  return (
    <Card 
      className={`achievement-card ${isEarned ? 'earned' : ''} ${achievement.type === 'consistency' ? 'consistency' : ''}`}
      role="article"
      aria-label={`Achievement: ${achievement.name}`}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        {/* Achievement Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '3rem',
              filter: isEarned ? 'none' : 'grayscale(50%)',
              opacity: isEarned ? 1 : 0.7
            }}
            aria-hidden="true"
          >
            {achievement.icon}
          </Typography>
        </Box>

        {/* Achievement Name */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            ...(isEarned && {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            })
          }}
        >
          {achievement.name}
        </Typography>

        {/* Achievement Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          {achievement.type === 'step_milestone' 
            ? `${formatNumber(achievement.steps)} total steps`
            : achievement.type === 'streak'
            ? `${achievement.days} consecutive wins`
            : `${achievement.days} days with 10K+ steps`
          }
        </Typography>

        {/* Progress Bar */}
        {showProgress && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getStatusText()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(achievement.progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={achievement.progress} 
              aria-label={`Progress: ${Math.round(achievement.progress)}%`}
              sx={{ 
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(),
                  borderRadius: 4
                }
              }}
            />
          </Box>
        )}

        {/* Remaining Steps/Days */}
        {!isEarned && achievement.remaining && (
          <Typography variant="caption" color="text.secondary">
            {achievement.type === 'step_milestone' 
              ? `${formatNumber(achievement.remaining)} steps to go`
              : achievement.type === 'streak'
              ? `${achievement.remaining} more days needed`
              : `${achievement.remaining} more 10K+ days needed`
            }
          </Typography>
        )}

        {/* Earned Badge */}
        {isEarned && (
          <Chip
            label="Earned"
            size="small"
            sx={{
              mt: 1,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: 600
            }}
          />
        )}
      </CardContent>
    </Card>
  );
} 