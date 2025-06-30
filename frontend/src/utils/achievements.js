import { ACHIEVEMENT_CONFIG, BADGES_CONFIG } from '../constants';

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

/**
 * Calculate all badges for all participants using day-by-day analysis
 * @param {Array} allParticipants - All participants data
 * @returns {Object} - Badges object with earned and progress
 */
export function calculateBadges(allParticipants = []) {
  if (!allParticipants || allParticipants.length === 0) return { earned: [], progress: [] };

  const allEarnedBadges = [];
  const badgeHistory = new Map(); // Track when each badge was first earned

  // Get the maximum number of days across all participants
  const maxDays = Math.max(...allParticipants.map(p => p.dailySteps?.length || 0));
  
  // Process each day to see who was first to achieve each badge
  for (let dayIndex = 0; dayIndex < maxDays; dayIndex++) {
    const dayBadges = processDayForBadges(allParticipants, dayIndex, badgeHistory);
    allEarnedBadges.push(...dayBadges);
  }

  // Calculate current best badges (only one person can hold these)
  const currentBests = calculateCurrentBestBadges(allParticipants);
  allEarnedBadges.push(...currentBests);

  return { earned: allEarnedBadges, progress: [] };
}

/**
 * Process a single day to see who was first to achieve each badge
 * @param {Array} allParticipants - All participants data
 * @param {number} dayIndex - The day index to process
 * @param {Map} badgeHistory - History of when badges were first earned
 * @returns {Array} - Badges earned on this day
 */
function processDayForBadges(allParticipants, dayIndex, badgeHistory) {
  const dayBadges = [];
  const startDate = new Date(2025, 0, 1); // January 1st, 2025
  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + dayIndex);

  // Get all participants' steps for this day
  const dayData = allParticipants.map(participant => ({
    name: participant.name,
    steps: participant.dailySteps?.[dayIndex] || 0,
    cumulativeSteps: participant.dailySteps?.slice(0, dayIndex + 1).reduce((sum, s) => sum + s, 0) || 0,
    dailySteps: participant.dailySteps?.slice(0, dayIndex + 1) || []
  }));

  // Check for step milestones (first to reach each milestone)
  ACHIEVEMENT_CONFIG.STEP_MILESTONES.forEach(milestone => {
    const badgeKey = `step_milestone_${milestone.id}`;
    if (!badgeHistory.has(badgeKey)) {
      const firstToReach = dayData.find(p => p.cumulativeSteps >= milestone.steps);
      if (firstToReach) {
        badgeHistory.set(badgeKey, firstToReach.name);
        dayBadges.push({
          ...milestone,
          type: 'step_milestone',
          earnedAt: currentDate.toISOString(),
          earnedBy: firstToReach.name,
          value: firstToReach.cumulativeSteps,
          dayIndex: dayIndex
        });
      }
    }
  });

  // Check for consistency achievements (first to reach each consistency milestone)
  ACHIEVEMENT_CONFIG.CONSISTENCY_ACHIEVEMENTS.forEach(consistency => {
    const badgeKey = `consistency_${consistency.id}`;
    if (!badgeHistory.has(badgeKey)) {
      const firstToReach = dayData.find(p => {
        const daysOver10k = p.dailySteps.filter(steps => steps >= 10000).length;
        return daysOver10k >= consistency.days;
      });
      if (firstToReach) {
        badgeHistory.set(badgeKey, firstToReach.name);
        dayBadges.push({
          ...consistency,
          type: 'consistency',
          earnedAt: currentDate.toISOString(),
          earnedBy: firstToReach.name,
          value: consistency.days,
          dayIndex: dayIndex
        });
      }
    }
  });

  // Check for funny badges (first to achieve each funny pattern)
  dayData.forEach(participant => {
    // Back-to-back same steps
    if (dayIndex > 0) {
      const previousSteps = participant.dailySteps[dayIndex - 1] || 0;
      if (participant.steps === previousSteps && participant.steps > 0) {
        const badgeKey = 'back_to_back_same';
        if (!badgeHistory.has(badgeKey)) {
          badgeHistory.set(badgeKey, participant.name);
          dayBadges.push({
            ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'back_to_back_same'),
            earnedAt: currentDate.toISOString(),
            earnedBy: participant.name,
            value: participant.steps,
            dayIndex: dayIndex
          });
        }
      }
    }

    // Palindrome steps
    const stepsStr = participant.steps.toString();
    if (stepsStr === stepsStr.split('').reverse().join('') && participant.steps > 0) {
      const badgeKey = 'palindrome_steps';
      if (!badgeHistory.has(badgeKey)) {
        badgeHistory.set(badgeKey, participant.name);
        dayBadges.push({
          ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'palindrome_steps'),
          earnedAt: currentDate.toISOString(),
          earnedBy: participant.name,
          value: participant.steps,
          dayIndex: dayIndex
        });
      }
    }

    // Lucky seven (ending in 777)
    if (participant.steps.toString().endsWith('777')) {
      const badgeKey = 'lucky_seven';
      if (!badgeHistory.has(badgeKey)) {
        badgeHistory.set(badgeKey, participant.name);
        dayBadges.push({
          ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'lucky_seven'),
          earnedAt: currentDate.toISOString(),
          earnedBy: participant.name,
          value: participant.steps,
          dayIndex: dayIndex
        });
      }
    }

    // Round numbers
    if (participant.steps === 10000 || participant.steps === 15000 || participant.steps === 20000) {
      const badgeKey = 'round_number';
      if (!badgeHistory.has(badgeKey)) {
        badgeHistory.set(badgeKey, participant.name);
        dayBadges.push({
          ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'round_number'),
          earnedAt: currentDate.toISOString(),
          earnedBy: participant.name,
          value: participant.steps,
          dayIndex: dayIndex
        });
      }
    }

    // Zero day
    if (participant.steps === 0) {
      const badgeKey = 'zero_day';
      if (!badgeHistory.has(badgeKey)) {
        badgeHistory.set(badgeKey, participant.name);
        dayBadges.push({
          ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'zero_day'),
          earnedAt: currentDate.toISOString(),
          earnedBy: participant.name,
          value: 0,
          dayIndex: dayIndex
        });
      }
    }

    // One step
    if (participant.steps === 1) {
      const badgeKey = 'one_step';
      if (!badgeHistory.has(badgeKey)) {
        badgeHistory.set(badgeKey, participant.name);
        dayBadges.push({
          ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'one_step'),
          earnedAt: currentDate.toISOString(),
          earnedBy: participant.name,
          value: 1,
          dayIndex: dayIndex
        });
      }
    }

    // Repeating patterns
    const patternStr = participant.steps.toString();
    if (patternStr.length >= 3) {
      const firstDigit = patternStr[0];
      const secondDigit = patternStr[1];
      let isRepeating = false;
      
      if (firstDigit === secondDigit) {
        isRepeating = patternStr.split('').every(digit => digit === firstDigit);
      } else {
        isRepeating = patternStr.split('').every((digit, index) => 
          index % 2 === 0 ? digit === firstDigit : digit === secondDigit
        );
      }
      
      if (isRepeating) {
        const badgeKey = 'repeating_pattern';
        if (!badgeHistory.has(badgeKey)) {
          badgeHistory.set(badgeKey, participant.name);
          dayBadges.push({
            ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'repeating_pattern'),
            earnedAt: currentDate.toISOString(),
            earnedBy: participant.name,
            value: participant.steps,
            dayIndex: dayIndex
          });
        }
      }
    }

    // Marathon man (26,000+ steps)
    if (participant.steps >= 26000) {
      const badgeKey = 'marathon_man';
      if (!badgeHistory.has(badgeKey)) {
        badgeHistory.set(badgeKey, participant.name);
        dayBadges.push({
          ...BADGES_CONFIG.SPECIAL_MILESTONES.find(b => b.id === 'marathon_man'),
          earnedAt: currentDate.toISOString(),
          earnedBy: participant.name,
          value: participant.steps,
          dayIndex: dayIndex
        });
      }
    }

    // Ultra marathon (50,000+ steps)
    if (participant.steps >= 50000) {
      const badgeKey = 'ultra_marathon';
      if (!badgeHistory.has(badgeKey)) {
        badgeHistory.set(badgeKey, participant.name);
        dayBadges.push({
          ...BADGES_CONFIG.SPECIAL_MILESTONES.find(b => b.id === 'ultra_marathon'),
          earnedAt: currentDate.toISOString(),
          earnedBy: participant.name,
          value: participant.steps,
          dayIndex: dayIndex
        });
      }
    }
  });

  // Check for lowest day (only one person can have this)
  const lowestDayKey = 'lowest_day';
  if (!badgeHistory.has(lowestDayKey)) {
    const allSteps = dayData.map(p => p.steps).filter(steps => steps > 0);
    if (allSteps.length > 0) {
      const globalMin = Math.min(...allSteps);
      const lowestPerson = dayData.find(p => p.steps === globalMin);
      if (lowestPerson) {
        badgeHistory.set(lowestDayKey, lowestPerson.name);
        dayBadges.push({
          ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'lowest_day'),
          earnedAt: currentDate.toISOString(),
          earnedBy: lowestPerson.name,
          value: globalMin,
          dayIndex: dayIndex
        });
      }
    }
  }

  return dayBadges;
}

/**
 * Calculate current best badges (only one person can hold these)
 */
function calculateCurrentBestBadges(allParticipants) {
  const badges = [];

  if (allParticipants.length === 0) return badges;

  // Find the best in each category and who holds them
  const bestTotalSteps = Math.max(...allParticipants.map(p => p.totalSteps || 0));
  const bestHighestDay = Math.max(...allParticipants.map(p => p.highestSingleDay || 0));
  const bestWinStreakOverall = Math.max(...allParticipants.map(p => p.bestWinStreak || 0));

  // Find who holds each current best
  const totalStepsHolder = allParticipants.find(p => p.totalSteps === bestTotalSteps);
  const highestDayHolder = allParticipants.find(p => p.highestSingleDay === bestHighestDay);
  const winStreakHolder = allParticipants.find(p => p.bestWinStreak === bestWinStreakOverall);

  // Current best badges should have today's date since they're current
  const today = new Date().toISOString();

  // Check if this participant holds any current bests
  if (totalStepsHolder) {
    badges.push({
      ...BADGES_CONFIG.CURRENT_BESTS.find(b => b.id === 'current_total_steps'),
      earnedAt: today,
      value: bestTotalSteps,
      earnedBy: totalStepsHolder.name
    });
  }

  if (highestDayHolder) {
    badges.push({
      ...BADGES_CONFIG.CURRENT_BESTS.find(b => b.id === 'current_highest_day'),
      earnedAt: today,
      value: bestHighestDay,
      earnedBy: highestDayHolder.name
    });
  }

  if (winStreakHolder) {
    badges.push({
      ...BADGES_CONFIG.CURRENT_BESTS.find(b => b.id === 'current_win_streak'),
      earnedAt: today,
      value: bestWinStreakOverall,
      earnedBy: winStreakHolder.name
    });
  }

  return badges;
}

/**
 * Get badge statistics
 * @param {Object} badges - Badges object
 * @returns {Object} - Statistics about badges
 */
export function getBadgeStats(badges) {
  const { earned } = badges;
  
  const totalBadges = BADGES_CONFIG.CURRENT_BESTS.length + 
                     BADGES_CONFIG.FUNNY_BADGES.length + 
                     BADGES_CONFIG.SPECIAL_MILESTONES.length;
  
  const byCategory = {
    current_best: earned.filter(b => b.category === 'current_best').length,
    funny: earned.filter(b => b.category === 'funny').length,
    milestone: earned.filter(b => b.category === 'milestone').length
  };
  
  return {
    total: totalBadges,
    earned: earned.length,
    completionRate: Math.round((earned.length / totalBadges) * 100),
    byCategory
  };
}

/**
 * Get recent badges (last 10 earned)
 * @param {Array} earned - Array of earned badges
 * @returns {Array} - Recent badges
 */
export function getRecentBadges(earned) {
  return earned
    .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
    .slice(0, 10);
} 