import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  ToggleButton, 
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  Avatar,
  useTheme
} from '@mui/material';
import { BADGES_CONFIG } from '../constants';
import { calculateBadges, getBadgeStats, getRecentBadges } from '../utils/achievements';

const BadgesSection = ({ participantData, allParticipants = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);
  const theme = useTheme();

  const badges = calculateBadges(allParticipants);
  const stats = getBadgeStats(badges);
  const recentBadges = getRecentBadges(badges.earned);

  const categories = [
    { id: 'all', name: 'All Badges', icon: '🏆' },
    { id: 'current_best', name: 'Current Bests', icon: '👑' },
    { id: 'funny', name: 'Funny Badges', icon: '😄' },
    { id: 'milestone', name: 'Milestones', icon: '⭐' }
  ];

  const getFilteredBadges = () => {
    let allBadges = [];
    
    // Add all badge types
    allBadges.push(...BADGES_CONFIG.CURRENT_BESTS);
    allBadges.push(...BADGES_CONFIG.FUNNY_BADGES);
    allBadges.push(...BADGES_CONFIG.SPECIAL_MILESTONES);

    // Filter by category
    if (selectedCategory !== 'all') {
      allBadges = allBadges.filter(badge => badge.category === selectedCategory);
    }

    // Filter by earned status
    if (showEarnedOnly) {
      const earnedIds = badges.earned.map(b => b.id);
      allBadges = allBadges.filter(badge => earnedIds.includes(badge.id));
    }

    return allBadges;
  };

  const getBadgeStatus = (badgeId) => {
    const earned = badges.earned.find(b => b.id === badgeId);
    if (earned) {
      return { 
        earned: true, 
        value: earned.value, 
        earnedAt: earned.earnedAt,
        earnedBy: earned.earnedBy || participantData?.name,
        earnedByCurrentPerson: earned.earnedBy === participantData?.name || !earned.earnedBy
      };
    }
    
    // Check if someone else has earned this badge
    const someoneElseEarned = checkIfSomeoneElseEarned(badgeId);
    return { 
      earned: false, 
      disabled: someoneElseEarned.disabled,
      earnedBy: someoneElseEarned.earnedBy
    };
  };

  const checkIfSomeoneElseEarned = (badgeId) => {
    // Check if someone else has already earned this badge based on actual data
    const someoneElseEarned = badges.earned.find(b => b.id === badgeId);
    if (someoneElseEarned) {
      return { 
        disabled: true, 
        earnedBy: someoneElseEarned.earnedBy 
      };
    }
    
    return { disabled: false, earnedBy: null };
  };

  const BadgeCard = ({ badge, status }) => (
    <Card sx={{ 
      height: '100%',
      position: 'relative',
      opacity: status.disabled ? 0.6 : 1,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: status.disabled ? 'none' : 'translateY(-2px)',
        boxShadow: status.disabled ? 1 : 4
      }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
        <Box sx={{ 
          fontSize: { xs: '2rem', sm: '3rem' }, 
          mb: 2,
          color: status.earned ? badge.color : theme.palette.text.disabled
        }}>
          {badge.icon}
        </Box>
        
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          mb: 1,
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}>
          {badge.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {badge.description}
        </Typography>
        
        {status.earned && (
          <Box sx={{ mb: 1 }}>
            <Chip 
              label={status.value} 
              size="small" 
              color="primary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: 'block', 
              mt: 0.5,
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}>
              {new Date(status.earnedAt).toLocaleDateString('en-GB')}
            </Typography>
          </Box>
        )}
        
        {status.earnedBy && status.earned && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}>
              Earned by: {status.earnedBy}
            </Typography>
          </Box>
        )}
        
        {status.disabled && !status.earned && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}>
              Already earned by {status.earnedBy}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      {status.earned && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: theme.palette.success.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          ✓
        </Box>
      )}
      
      {status.disabled && !status.earned && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: theme.palette.grey[400],
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem'
        }}>
          🔒
        </Box>
      )}
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header with stats */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}>
            🏅 Badges & Achievements
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Fun achievements for the friend group
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: theme.palette.primary.main,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {stats.earned}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Earned
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: theme.palette.info.main,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Total
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: theme.palette.success.main,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}>
                {stats.completionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Complete
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={selectedCategory}
            exclusive
            onChange={(e, newValue) => newValue && setSelectedCategory(newValue)}
            size="small"
            sx={{ 
              flexWrap: 'wrap',
              '& .MuiToggleButton-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          >
            {categories.map(category => (
              <ToggleButton key={category.id} value={category.id}>
                {category.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        
        <FormControlLabel
          control={
            <Switch
              checked={showEarnedOnly}
              onChange={(e) => setShowEarnedOnly(e.target.checked)}
              size="small"
            />
          }
          label="Show earned only"
          sx={{ 
            '& .MuiFormControlLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }
          }}
        />
      </Box>

      {/* Badges grid */}
      <Grid container spacing={2}>
        {getFilteredBadges().map((badge, index) => {
          const status = getBadgeStatus(badge.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${badge.id}-${index}`}>
              <BadgeCard badge={badge} status={status} />
            </Grid>
          );
        })}
      </Grid>

      {/* Empty state */}
      {getFilteredBadges().length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          color: theme.palette.text.secondary
        }}>
          <Box sx={{ fontSize: '4rem', mb: 2 }}>🏆</Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            mb: 1,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}>
            No badges found
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Try adjusting your filters or keep stepping to earn more badges!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BadgesSection; 