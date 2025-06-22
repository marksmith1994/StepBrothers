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
    <Card className={`achievement-card ${isEarned ? 'earned' : ''} ${achievement.type === 'consistency' ? 'consistency' : ''}`}>
      <CardContent className="text-center p-3">
        {/* Achievement Icon */}
        <Box className="flex-center mb-2">
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '3rem',
              filter: isEarned ? 'none' : 'grayscale(50%)',
              opacity: isEarned ? 1 : 0.7
            }}
          >
            {achievement.icon}
          </Typography>
        </Box>

        {/* Achievement Name */}
        <Typography 
          variant="h6" 
          className={`text-bold mb-1 ${isEarned ? 'gradient-text-success' : ''}`}
        >
          {achievement.name}
        </Typography>

        {/* Achievement Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          className="mb-2"
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
          <Box className="mb-2">
            <Box className="flex-between mb-1">
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
              className="progress-glass"
              sx={{ 
                height: 8,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(),
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
            className="chip-gradient mt-1"
          />
        )}
      </CardContent>
    </Card>
  );
} 