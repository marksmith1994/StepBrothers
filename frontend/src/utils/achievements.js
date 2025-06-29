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
 * Calculate all badges for all participants
 * @param {Array} allParticipants - All participants data
 * @returns {Object} - Badges object with earned and progress
 */
export function calculateBadges(allParticipants = []) {
  if (!allParticipants || allParticipants.length === 0) return { earned: [], progress: [] };

  const allEarnedBadges = [];

  // Calculate current best badges (only one person can hold these)
  const currentBests = calculateCurrentBestBadges(allParticipants);
  allEarnedBadges.push(...currentBests);

  // Calculate funny badges for each participant
  allParticipants.forEach(participant => {
    const funnyBadges = calculateFunnyBadges(participant, allParticipants);
    allEarnedBadges.push(...funnyBadges);
  });

  // Calculate milestone badges for each participant
  allParticipants.forEach(participant => {
    const milestoneBadges = calculateMilestoneBadges(participant, allParticipants);
    allEarnedBadges.push(...milestoneBadges);
  });

  return { earned: allEarnedBadges, progress: [] };
}

/**
 * Calculate current best badges (only one person can hold these)
 */
function calculateCurrentBestBadges(allParticipants) {
  const badges = [];

  if (allParticipants.length === 0) return badges;

  // Find the best in each category and who holds them
  const bestTotalSteps = Math.max(...allParticipants.map(p => p.totalSteps || 0));
  const bestAvgSteps = Math.max(...allParticipants.map(p => p.averageStepsPerDay || 0));
  const bestHighestDay = Math.max(...allParticipants.map(p => p.highestSingleDay || 0));
  const bestWinStreakOverall = Math.max(...allParticipants.map(p => p.bestWinStreak || 0));

  // Find who holds each current best
  const totalStepsHolder = allParticipants.find(p => p.totalSteps === bestTotalSteps);
  const avgStepsHolder = allParticipants.find(p => p.averageStepsPerDay === bestAvgSteps);
  const highestDayHolder = allParticipants.find(p => p.highestSingleDay === bestHighestDay);
  const winStreakHolder = allParticipants.find(p => p.bestWinStreak === bestWinStreakOverall);

  // Check if this participant holds any current bests
  if (totalStepsHolder) {
    badges.push({
      ...BADGES_CONFIG.CURRENT_BESTS.find(b => b.id === 'current_total_steps'),
      earnedAt: getEarnedDate(totalStepsHolder, 'totalSteps', bestTotalSteps),
      value: bestTotalSteps,
      earnedBy: totalStepsHolder.name
    });
  }

  if (avgStepsHolder) {
    badges.push({
      ...BADGES_CONFIG.CURRENT_BESTS.find(b => b.id === 'current_avg_steps'),
      earnedAt: getEarnedDate(avgStepsHolder, 'averageStepsPerDay', bestAvgSteps),
      value: Math.round(bestAvgSteps),
      earnedBy: avgStepsHolder.name
    });
  }

  if (highestDayHolder) {
    badges.push({
      ...BADGES_CONFIG.CURRENT_BESTS.find(b => b.id === 'current_highest_day'),
      earnedAt: getEarnedDate(highestDayHolder, 'highestSingleDay', bestHighestDay),
      value: bestHighestDay,
      earnedBy: highestDayHolder.name
    });
  }

  if (winStreakHolder) {
    badges.push({
      ...BADGES_CONFIG.CURRENT_BESTS.find(b => b.id === 'current_win_streak'),
      earnedAt: getEarnedDate(winStreakHolder, 'bestWinStreak', bestWinStreakOverall),
      value: bestWinStreakOverall,
      earnedBy: winStreakHolder.name
    });
  }

  return badges;
}

/**
 * Get a realistic earned date based on the participant's actual data
 */
function getEarnedDate(participantData, achievementType, value) {
  // Use the participant's actual data to determine when they likely earned the badge
  // For now, we'll use a reasonable estimate based on their current stats
  
  const now = new Date();
  const { dailySteps = [], averageStepsPerDay = 0 } = participantData;
  
  // Calculate how many days they've been tracking
  const daysTracked = dailySteps.length;
  if (daysTracked === 0) {
    // Fallback to a recent date if no data
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
  
  switch (achievementType) {
    case 'totalSteps': {
      // Estimate when they reached this total based on their average
      if (averageStepsPerDay > 0) {
        const daysToReach = Math.floor(value / averageStepsPerDay);
        const totalStepsDate = new Date(now.getTime() - (daysTracked - daysToReach) * 24 * 60 * 60 * 1000);
        return totalStepsDate.toISOString();
      }
      break;
    }
    
    case 'averageStepsPerDay': {
      // Estimate when they achieved this average
      const daysToAchieve = Math.floor(daysTracked * 0.7); // Assume they achieved it 70% through their tracking
      const avgStepsDate = new Date(now.getTime() - (daysTracked - daysToAchieve) * 24 * 60 * 60 * 1000);
      return avgStepsDate.toISOString();
    }
    
    case 'highestSingleDay': {
      // Find when they likely achieved their highest day
      const highestDayIndex = dailySteps.indexOf(value);
      if (highestDayIndex !== -1) {
        const daysAgo = daysTracked - highestDayIndex;
        return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      }
      break;
    }
    
    case 'bestWinStreak': {
      // Estimate when they achieved their best streak
      const daysToStreak = Math.floor(daysTracked * 0.8); // Assume they achieved it 80% through
      const streakDate = new Date(now.getTime() - (daysTracked - daysToStreak) * 24 * 60 * 60 * 1000);
      return streakDate.toISOString();
    }
    
    case 'back_to_back_same':
    case 'palindrome_steps':
    case 'lucky_seven':
    case 'round_number':
    case 'repeating_pattern': {
      // Find when they likely achieved these funny badges
      const funnyDayIndex = dailySteps.findIndex((steps, index) => {
        switch (achievementType) {
          case 'back_to_back_same': {
            // Find when they had consecutive days with the same steps
            if (index > 0 && steps === dailySteps[index - 1] && steps > 0) {
              return true;
            }
            return false;
          }
          case 'palindrome_steps': {
            const stepsStr = steps.toString();
            return stepsStr === stepsStr.split('').reverse().join('') && steps > 0;
          }
          case 'lucky_seven': {
            return steps.toString().endsWith('777');
          }
          case 'round_number': {
            return steps === 10000 || steps === 15000 || steps === 20000;
          }
          case 'repeating_pattern': {
            const patternStr = steps.toString();
            if (patternStr.length < 3) return false;
            const firstDigit = patternStr[0];
            const secondDigit = patternStr[1];
            if (firstDigit === secondDigit) {
              return patternStr.split('').every(digit => digit === firstDigit);
            } else {
              return patternStr.split('').every((digit, index) => 
                index % 2 === 0 ? digit === firstDigit : digit === secondDigit
              );
            }
          }
          default:
            return false;
        }
      });
      
      if (funnyDayIndex !== -1) {
        const daysAgo = daysTracked - funnyDayIndex;
        return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      }
      break;
    }
    
    case 'zero_day':
    case 'one_step': {
      // Find when they had 0 or 1 step
      const specialDayIndex = dailySteps.indexOf(value);
      if (specialDayIndex !== -1) {
        const daysAgo = daysTracked - specialDayIndex;
        return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      }
      break;
    }
    
    case 'lowest_day': {
      // Find when they had their lowest day
      const minSteps = Math.min(...dailySteps.filter(steps => steps > 0));
      const lowestDayIndex = dailySteps.indexOf(minSteps);
      if (lowestDayIndex !== -1) {
        const daysAgo = daysTracked - lowestDayIndex;
        return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      }
      break;
    }
    
    case 'first_win':
    case 'speed_demon':
    case 'marathon_man':
    case 'ultra_marathon':
    case 'consistency_master': {
      // Estimate when they achieved these milestones
      const milestoneDaysAgo = Math.floor(daysTracked * 0.6); // Assume they achieved it 60% through
      const milestoneDate = new Date(now.getTime() - milestoneDaysAgo * 24 * 60 * 60 * 1000);
      return milestoneDate.toISOString();
    }
    
    default: {
      // Fallback to a reasonable recent date
      const fallbackDaysAgo = Math.floor(daysTracked * 0.5);
      return new Date(now.getTime() - fallbackDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    }
  }
  
  // Fallback if no specific logic applies
  const fallbackDaysAgo = Math.floor(daysTracked * 0.5);
  return new Date(now.getTime() - fallbackDaysAgo * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Calculate funny/quirky badges
 */
function calculateFunnyBadges(participantData, allParticipants) {
  const badges = [];
  const { dailySteps = [], name } = participantData;

  // Check for back-to-back same steps
  for (let i = 1; i < dailySteps.length; i++) {
    if (dailySteps[i] === dailySteps[i - 1] && dailySteps[i] > 0) {
      // Check if someone else already has this badge
      const alreadyEarned = checkIfBadgeAlreadyEarned('back_to_back_same', allParticipants, name);
      if (!alreadyEarned) {
        badges.push({
          ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'back_to_back_same'),
          earnedAt: getEarnedDate(participantData, 'back_to_back_same', dailySteps[i]),
          value: dailySteps[i],
          earnedBy: name
        });
      }
      break;
    }
  }

  // Check for palindrome steps
  const palindromeDay = dailySteps.find(steps => {
    const stepsStr = steps.toString();
    return stepsStr === stepsStr.split('').reverse().join('') && steps > 0;
  });
  if (palindromeDay) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('palindrome_steps', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'palindrome_steps'),
        earnedAt: getEarnedDate(participantData, 'palindrome_steps', palindromeDay),
        value: palindromeDay,
        earnedBy: name
      });
    }
  }

  // Check for lucky seven (ending in 777)
  const luckySevenDay = dailySteps.find(steps => steps.toString().endsWith('777'));
  if (luckySevenDay) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('lucky_seven', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'lucky_seven'),
        earnedAt: getEarnedDate(participantData, 'lucky_seven', luckySevenDay),
        value: luckySevenDay,
        earnedBy: name
      });
    }
  }

  // Check for round numbers
  const roundNumberDay = dailySteps.find(steps => 
    steps === 10000 || steps === 15000 || steps === 20000
  );
  if (roundNumberDay) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('round_number', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'round_number'),
        earnedAt: getEarnedDate(participantData, 'round_number', roundNumberDay),
        value: roundNumberDay,
        earnedBy: name
      });
    }
  }

  // Check for zero day
  if (dailySteps.includes(0)) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('zero_day', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'zero_day'),
        earnedAt: getEarnedDate(participantData, 'zero_day', 0),
        value: 0,
        earnedBy: name
      });
    }
  }

  // Check for one step
  if (dailySteps.includes(1)) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('one_step', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'one_step'),
        earnedAt: getEarnedDate(participantData, 'one_step', 1),
        value: 1,
        earnedBy: name
      });
    }
  }

  // Check for repeating patterns
  const repeatingPatternDay = dailySteps.find(steps => {
    const stepsStr = steps.toString();
    if (stepsStr.length < 3) return false;
    
    // Check for patterns like 12121, 99999, etc.
    const firstDigit = stepsStr[0];
    const secondDigit = stepsStr[1];
    
    if (firstDigit === secondDigit) {
      // All same digits
      return stepsStr.split('').every(digit => digit === firstDigit);
    } else {
      // Alternating pattern
      return stepsStr.split('').every((digit, index) => 
        index % 2 === 0 ? digit === firstDigit : digit === secondDigit
      );
    }
  });
  if (repeatingPatternDay) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('repeating_pattern', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'repeating_pattern'),
        earnedAt: getEarnedDate(participantData, 'repeating_pattern', repeatingPatternDay),
        value: repeatingPatternDay,
        earnedBy: name
      });
    }
  }

  // Lowest day (this is a "funny" badge for the group)
  // Find the actual lowest day across all participants
  const allSteps = allParticipants.flatMap(p => p.dailySteps || []);
  const globalMinSteps = Math.min(...allSteps);
  
  // Check if this participant has the global lowest day
  if (dailySteps.includes(globalMinSteps)) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('lowest_day', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.FUNNY_BADGES.find(b => b.id === 'lowest_day'),
        earnedAt: getEarnedDate(participantData, 'lowest_day', globalMinSteps),
        value: globalMinSteps,
        earnedBy: name
      });
    }
  }

  return badges;
}

/**
 * Check if a badge has already been earned by someone else
 */
function checkIfBadgeAlreadyEarned(badgeId, allParticipants, currentPersonName) {
  // Current best badges can be won by whoever is currently the best
  if (badgeId.startsWith('current_')) {
    return false; // These are handled separately in calculateCurrentBestBadges
  }
  
  // For other badges, check if someone else has already earned them
  // In a real app, you'd have a proper badge tracking system
  // For now, we'll simulate that the first person in the list gets them
  // and subsequent people can't earn the same badge
  
  const firstPerson = allParticipants[0];
  return firstPerson && firstPerson.name !== currentPersonName;
}

/**
 * Calculate milestone badges
 */
function calculateMilestoneBadges(participantData, allParticipants) {
  const badges = [];
  const { dailySteps = [], totalWins = 0, bestWinStreak = 0, name } = participantData;

  // First win (this would need to be tracked over time, but for now we'll assume)
  if (totalWins > 0) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('first_win', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.SPECIAL_MILESTONES.find(b => b.id === 'first_win'),
        earnedAt: getEarnedDate(participantData, 'first_win', totalWins),
        value: totalWins,
        earnedBy: name
      });
    }
  }

  // Speed demon (3 wins in a row)
  if (bestWinStreak >= 3) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('speed_demon', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.SPECIAL_MILESTONES.find(b => b.id === 'speed_demon'),
        earnedAt: getEarnedDate(participantData, 'speed_demon', bestWinStreak),
        value: bestWinStreak,
        earnedBy: name
      });
    }
  }

  // Marathon man (26,000+ steps in a day)
  const marathonDay = dailySteps.find(steps => steps >= 26000);
  if (marathonDay) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('marathon_man', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.SPECIAL_MILESTONES.find(b => b.id === 'marathon_man'),
        earnedAt: getEarnedDate(participantData, 'marathon_man', marathonDay),
        value: marathonDay,
        earnedBy: name
      });
    }
  }

  // Ultra marathon (50,000+ steps in a day)
  const ultraMarathonDay = dailySteps.find(steps => steps >= 50000);
  if (ultraMarathonDay) {
    const alreadyEarned = checkIfBadgeAlreadyEarned('ultra_marathon', allParticipants, name);
    if (!alreadyEarned) {
      badges.push({
        ...BADGES_CONFIG.SPECIAL_MILESTONES.find(b => b.id === 'ultra_marathon'),
        earnedAt: getEarnedDate(participantData, 'ultra_marathon', ultraMarathonDay),
        value: ultraMarathonDay,
        earnedBy: name
      });
    }
  }

  // Consistency master (7 consecutive days over 10K)
  let consecutiveOver10k = 0;
  for (let i = 0; i < dailySteps.length; i++) {
    if (dailySteps[i] >= 10000) {
      consecutiveOver10k++;
      if (consecutiveOver10k >= 7) {
        const alreadyEarned = checkIfBadgeAlreadyEarned('consistency_master', allParticipants, name);
        if (!alreadyEarned) {
          badges.push({
            ...BADGES_CONFIG.SPECIAL_MILESTONES.find(b => b.id === 'consistency_master'),
            earnedAt: getEarnedDate(participantData, 'consistency_master', consecutiveOver10k),
            value: consecutiveOver10k,
            earnedBy: name
          });
        }
        break;
      }
    } else {
      consecutiveOver10k = 0;
    }
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