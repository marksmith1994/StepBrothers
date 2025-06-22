/**
 * Utility functions for common operations
 */

/**
 * Get initials from a name
 * @param {string} name - The full name
 * @returns {string} - The initials (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format a number with commas
 * @param {number} num - The number to format
 * @returns {string} - The formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString();
};

/**
 * Format a number as steps with "k" suffix for thousands
 * @param {number} num - The number to format
 * @returns {string} - The formatted number (e.g., "1.5k")
 */
export const formatSteps = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

/**
 * Get a color from a predefined palette based on index
 * @param {number} index - The index for the color
 * @returns {string} - The hex color
 */
export const getColorFromPalette = (index) => {
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#ec4899'  // Pink
  ];
  return colors[index % colors.length];
};

/**
 * Calculate percentage
 * @param {number} value - The current value
 * @param {number} total - The total value
 * @returns {number} - The percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get streak color based on streak type and length
 * @param {boolean} isWinStreak - Whether it's a win streak
 * @param {number} streakLength - The length of the streak
 * @returns {string} - The color hex code
 */
export const getStreakColor = (isWinStreak, streakLength) => {
  if (isWinStreak) {
    if (streakLength >= 7) return '#fbbf24'; // Gold for 7+ days
    if (streakLength >= 3) return '#f97316'; // Orange for 3+ days
    return '#10b981'; // Green for any win streak
  } else {
    if (streakLength >= 5) return '#ef4444'; // Red for 5+ day losing streak
    if (streakLength >= 3) return '#f97316'; // Orange for 3-4 day losing streak
    return '#f59e0b'; // Yellow for 1-2 day losing streak
  }
};

/**
 * Get appropriate text for streak display
 * @param {boolean} isWinStreak - Whether it's a win streak
 * @param {number} streakLength - The length of the streak
 * @returns {string} - The display text
 */
export const getStreakText = (isWinStreak, streakLength) => {
  if (isWinStreak) {
    if (streakLength === 0) return 'No current win streak';
    if (streakLength === 1) return '1 day win streak';
    return `${streakLength} day win streak`;
  } else {
    if (streakLength === 0) return 'No current losing streak';
    if (streakLength === 1) return '1 day losing streak';
    return `${streakLength} day losing streak`;
  }
};

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}; 