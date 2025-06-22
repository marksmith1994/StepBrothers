import { ACHIEVEMENT_CONFIG } from '../constants';

/**
 * Calculate achievements for a participant based on their step data
 * @param {Object} participantData - Participant data from the API
 * @returns {Object} - Achievements object with earned and progress
 */
export function calculateAchievements(participantData) {
  if (!participantData) return { earned: [], progress: [] };

  const totalSteps = participantData.totalSteps || 0;
  const dailySteps = participantData.dailySteps || [];

  const earned = [];
  const progress = [];

  // Check step milestones
  ACHIEVEMENT_CONFIG.STEP_MILESTONES.forEach(milestone => {
    if (totalSteps >= milestone.steps) {
      earned.push({
        ...milestone,
        type: 'step_milestone',
        earnedAt: new Date().toISOString(), // In real app, this would come from backend
        progress: 100
      });
    } else {
      progress.push({
        ...milestone,
        type: 'step_milestone',
        progress: Math.min(100, (totalSteps / milestone.steps) * 100),
        remaining: milestone.steps - totalSteps
      });
    }
  });

  // Check consistency achievements (10K+ steps per day)
  const daysOver10k = dailySteps.filter(steps => steps >= 10000).length;
  
  ACHIEVEMENT_CONFIG.CONSISTENCY_ACHIEVEMENTS.forEach(consistency => {
    if (daysOver10k >= consistency.days) {
      earned.push({
        ...consistency,
        type: 'consistency',
        earnedAt: new Date().toISOString(),
        progress: 100
      });
    } else {
      progress.push({
        ...consistency,
        type: 'consistency',
        progress: Math.min(100, (daysOver10k / consistency.days) * 100),
        remaining: consistency.days - daysOver10k
      });
    }
  });

  return { earned, progress };
}

/**
 * Get achievement statistics
 * @param {Object} achievements - Achievements object
 * @returns {Object} - Statistics about achievements
 */
export function getAchievementStats(achievements) {
  const { earned, progress } = achievements;
  
  const totalAchievements = ACHIEVEMENT_CONFIG.STEP_MILESTONES.length + 
                           ACHIEVEMENT_CONFIG.CONSISTENCY_ACHIEVEMENTS.length;
  
  return {
    total: totalAchievements,
    earned: earned.length,
    progress: progress.length,
    completionRate: Math.round((earned.length / totalAchievements) * 100),
    nextAchievement: progress.length > 0 ? progress[0] : null
  };
}

/**
 * Get recent achievements (last 5 earned)
 * @param {Array} earned - Array of earned achievements
 * @returns {Array} - Recent achievements
 */
export function getRecentAchievements(earned) {
  return earned
    .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
    .slice(0, 5);
} 