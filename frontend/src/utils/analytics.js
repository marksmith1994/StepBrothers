/**
 * Calculate personal analytics from step data
 * @param {Object} participantData - Participant data from the API
 * @returns {Object} - Analytics object with trends and insights
 */
export function calculatePersonalAnalytics(participantData) {
  if (!participantData || !participantData.dailySteps) {
    return {
      trends: {},
      insights: [],
      stats: {},
      records: {},
      monthlyData: {}
    };
  }

  const dailySteps = participantData.dailySteps;
  const totalSteps = participantData.totalSteps || 0;
  const averageSteps = participantData.averageSteps || 0;

  // Calculate trends
  const trends = calculateTrends(dailySteps);
  
  // Generate insights
  const insights = generateInsights(dailySteps, totalSteps, averageSteps);
  
  // Calculate additional stats
  const stats = calculateStats(dailySteps);
  
  // Calculate records and achievements
  const records = calculateRecords(dailySteps);
  
  // Calculate monthly breakdown
  const monthlyData = calculateMonthlyData(dailySteps);

  return { trends, insights, stats, records, monthlyData };
}

/**
 * Calculate trends from step data
 * @param {Array} dailySteps - Array of daily step counts
 * @returns {Object} - Trends object
 */
function calculateTrends(dailySteps) {
  if (dailySteps.length < 7) {
    return {
      weeklyTrend: 'stable',
      improvement: 0,
      consistency: 100
    };
  }

  const last7Days = dailySteps.slice(-7);
  const previous7Days = dailySteps.slice(-14, -7);
  
  const last7Average = last7Days.reduce((sum, steps) => sum + steps, 0) / last7Days.length;
  const previous7Average = previous7Days.reduce((sum, steps) => sum + steps, 0) / previous7Days.length;
  
  const improvement = previous7Average > 0 ? ((last7Average - previous7Average) / previous7Average) * 100 : 0;
  
  // Calculate consistency (days within 20% of average)
  const overallAverage = dailySteps.reduce((sum, steps) => sum + steps, 0) / dailySteps.length;
  const consistentDays = dailySteps.filter(steps => 
    steps >= overallAverage * 0.8 && steps <= overallAverage * 1.2
  ).length;
  const consistency = Math.round((consistentDays / dailySteps.length) * 100);

  return {
    weeklyTrend: improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
    improvement: Math.round(improvement),
    consistency
  };
}

/**
 * Generate insights from step data
 * @param {Array} dailySteps - Array of daily step counts
 * @param {number} totalSteps - Total steps
 * @param {number} averageSteps - Average daily steps
 * @returns {Array} - Array of insight strings
 */
function generateInsights(dailySteps, totalSteps, averageSteps) {
  const insights = [];

  // Best day insight
  const bestDay = Math.max(...dailySteps);
  const bestDayIndex = dailySteps.indexOf(bestDay);
  if (bestDay > 0) {
    insights.push(`🏆 Your best day was day ${bestDayIndex + 1} with ${bestDay.toLocaleString()} steps!`);
  }

  // Consistency insight
  const zeroDays = dailySteps.filter(steps => steps === 0).length;
  const activeDays = dailySteps.length - zeroDays;
  
  if (zeroDays === 0) {
    insights.push("🎯 Perfect! You haven't missed a single day of tracking.");
  } else if (zeroDays <= 3) {
    insights.push(`💪 Great consistency! You've only missed ${zeroDays} day${zeroDays > 1 ? 's' : ''} of tracking.`);
  } else if (activeDays >= 30) {
    insights.push(`📊 You've tracked ${activeDays} days with an average of ${Math.round(averageSteps).toLocaleString()} steps per day.`);
  }

  // Average insight
  if (averageSteps >= 10000) {
    insights.push("🚀 You're consistently hitting the recommended 10,000 steps per day!");
  } else if (averageSteps >= 7500) {
    insights.push("🎯 You're close to the 10,000 steps goal. Keep it up!");
  } else if (averageSteps >= 5000) {
    insights.push("📈 You're building a great habit! Consider increasing your daily goal.");
  }

  // Recent performance
  const last7Days = dailySteps.slice(-7);
  const last7Average = last7Days.reduce((sum, steps) => sum + steps, 0) / last7Days.length;
  
  if (last7Average > averageSteps * 1.2) {
    insights.push("🔥 Your recent performance is above your average. You're on fire!");
  } else if (last7Average < averageSteps * 0.8) {
    insights.push("💡 Your recent performance is below your average. Time to step it up!");
  }

  // Streak insights
  const currentStreak = calculateCurrentStreak(dailySteps);
  if (currentStreak > 7) {
    insights.push(`🔥 Amazing! You're on a ${currentStreak}-day active streak!`);
  } else if (currentStreak > 3) {
    insights.push(`👍 Nice! You're on a ${currentStreak}-day active streak.`);
  }

  // 10K+ consistency
  const daysOver10k = dailySteps.filter(steps => steps >= 10000).length;
  if (daysOver10k >= 100) {
    insights.push(`👟 Incredible! You've hit 10K+ steps ${daysOver10k} times!`);
  } else if (daysOver10k >= 50) {
    insights.push(`👟 Great work! You've hit 10K+ steps ${daysOver10k} times.`);
  } else if (daysOver10k >= 10) {
    insights.push(`👟 Good start! You've hit 10K+ steps ${daysOver10k} times.`);
  }

  return insights;
}

/**
 * Calculate additional statistics
 * @param {Array} dailySteps - Array of daily step counts
 * @returns {Object} - Additional statistics
 */
function calculateStats(dailySteps) {
  const nonZeroDays = dailySteps.filter(steps => steps > 0);
  const zeroDays = dailySteps.length - nonZeroDays.length;
  
  return {
    totalDays: dailySteps.length,
    activeDays: nonZeroDays.length,
    inactiveDays: zeroDays,
    activityRate: Math.round((nonZeroDays.length / dailySteps.length) * 100),
    highestDay: Math.max(...dailySteps),
    lowestDay: Math.min(...dailySteps.filter(steps => steps > 0)),
    daysOver10k: dailySteps.filter(steps => steps >= 10000).length,
    daysOver5k: dailySteps.filter(steps => steps >= 5000).length,
    currentStreak: calculateCurrentStreak(dailySteps),
    bestStreak: calculateBestStreak(dailySteps)
  };
}

/**
 * Calculate records and achievements
 * @param {Array} dailySteps - Array of daily step counts
 * @returns {Object} - Records object
 */
function calculateRecords(dailySteps) {
  const bestDay = Math.max(...dailySteps);
  const bestDayIndex = dailySteps.indexOf(bestDay);
  
  // Calculate monthly totals (assuming 30 days per month)
  const monthlyTotals = [];
  const daysPerMonth = 30;
  
  for (let i = 0; i < dailySteps.length; i += daysPerMonth) {
    const monthData = dailySteps.slice(i, i + daysPerMonth);
    const monthTotal = monthData.reduce((sum, steps) => sum + steps, 0);
    monthlyTotals.push({
      month: Math.floor(i / daysPerMonth) + 1,
      total: monthTotal,
      days: monthData.length
    });
  }
  
  const bestMonth = monthlyTotals.reduce((best, current) => 
    current.total > best.total ? current : best, { total: 0, month: 0 }
  );

  return {
    bestDay: {
      steps: bestDay,
      day: bestDayIndex + 1,
      date: `Day ${bestDayIndex + 1}`
    },
    bestMonth: bestMonth.total > 0 ? {
      total: bestMonth.total,
      month: bestMonth.month,
      average: Math.round(bestMonth.total / bestMonth.days)
    } : null,
    totalRecords: {
      totalSteps: dailySteps.reduce((sum, steps) => sum + steps, 0),
      averageSteps: Math.round(dailySteps.reduce((sum, steps) => sum + steps, 0) / dailySteps.length),
      daysTracked: dailySteps.length
    }
  };
}

/**
 * Calculate monthly data breakdown
 * @param {Array} dailySteps - Array of daily step counts
 * @returns {Object} - Monthly data
 */
function calculateMonthlyData(dailySteps) {
  const monthlyData = {};
  const daysPerMonth = 30;
  
  for (let i = 0; i < dailySteps.length; i += daysPerMonth) {
    const monthIndex = Math.floor(i / daysPerMonth) + 1;
    const monthData = dailySteps.slice(i, i + daysPerMonth);
    
    monthlyData[monthIndex] = {
      total: monthData.reduce((sum, steps) => sum + steps, 0),
      average: Math.round(monthData.reduce((sum, steps) => sum + steps, 0) / monthData.length),
      days: monthData.length,
      activeDays: monthData.filter(steps => steps > 0).length,
      daysOver10k: monthData.filter(steps => steps >= 10000).length,
      bestDay: Math.max(...monthData)
    };
  }
  
  return monthlyData;
}

/**
 * Calculate current active streak
 * @param {Array} dailySteps - Array of daily step counts
 * @returns {number} - Current streak length
 */
function calculateCurrentStreak(dailySteps) {
  let streak = 0;
  for (let i = dailySteps.length - 1; i >= 0; i--) {
    if (dailySteps[i] > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Calculate best active streak
 * @param {Array} dailySteps - Array of daily step counts
 * @returns {number} - Best streak length
 */
function calculateBestStreak(dailySteps) {
  let currentStreak = 0;
  let bestStreak = 0;
  
  for (let i = 0; i < dailySteps.length; i++) {
    if (dailySteps[i] > 0) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return bestStreak;
} 