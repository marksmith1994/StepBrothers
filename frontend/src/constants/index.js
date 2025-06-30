/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://stepbrothers.azurewebsites.net',
  ENDPOINTS: {
    SHEETS_DATA: '/api/sheets/data',
    SHEETS_TOTALS: '/api/sheets/totals',
    SHEETS_GAMIFICATION: '/api/sheets/gamification',
    SHEETS_PARTICIPANT: '/api/sheets/participant',
    SHEETS_TABS: '/api/sheets/tabs'
  }
};

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#ec4899'  // Pink
  ],
  HEIGHT: 400,
  MARGIN: { top: 20, right: 30, left: 20, bottom: 20 }
};

// Streak Configuration
export const STREAK_CONFIG = {
  GOLD_THRESHOLD: 7,    // Days for gold streak
  ORANGE_THRESHOLD: 3,  // Days for orange streak
  COLORS: {
    GOLD: '#fbbf24',
    ORANGE: '#f97316',
    GREEN: '#10b981',
    RED: '#ef4444'
  }
};

// Navigation Configuration
export const NAV_CONFIG = {
  TABS: [
    { label: '🏆 Leaderboard', value: 0 },
    { label: '🔥 Streaks', value: 1 },
    { label: '📊 Progress', value: 2 },
    { label: '⭐ All-Time Bests', value: 3 },
    { label: '🏅 Badges', value: 4 }
  ]
};

// Data Grid Configuration
export const GRID_CONFIG = {
  PAGE_SIZE: 8,
  PAGE_SIZE_OPTIONS: [8, 16, 32],
  ROW_HEIGHT: 52
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  DURATION: 300,
  EASING: 'ease-in-out'
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  MOBILE: 'xs',
  TABLET: 'md',
  DESKTOP: 'lg'
};

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  PREFIX: 'stepbrothers_cache_',
  CLEANUP_INTERVAL: 60 * 60 * 1000 // 1 hour
};

// Achievement Configuration
export const ACHIEVEMENT_CONFIG = {
  STEP_MILESTONES: [
    { id: '500k', name: '500K Steps', steps: 500000, icon: '🏆', color: '#9C27B0' },
    { id: '1m', name: '1M Steps', steps: 1000000, icon: '👑', color: '#FFD700' },
    { id: '2m', name: '2M Steps', steps: 2000000, icon: '💎', color: '#E91E63' },
    { id: '3m', name: '3M Steps', steps: 3000000, icon: '🌟', color: '#FF5722' },
    { id: '4m', name: '4M Steps', steps: 4000000, icon: '🚀', color: '#00BCD4' },
    { id: '5m', name: '5M Steps', steps: 5000000, icon: '⚡', color: '#9C27B0' }
  ],
  CONSISTENCY_ACHIEVEMENTS: [
    { id: '10k_100', name: '100 Days of 10K+', days: 100, icon: '👟', color: '#4CAF50' },
    { id: '10k_200', name: '200 Days of 10K+', days: 200, icon: '👟👟', color: '#2196F3' },
    { id: '10k_300', name: '300 Days of 10K+', days: 300, icon: '👟👟👟', color: '#FF9800' },
    { id: '10k_365', name: '365 Days of 10K+', days: 365, icon: '👟👟👟👟', color: '#9C27B0' }
  ]
};

// Badges Configuration - Fun achievements for the friend group
export const BADGES_CONFIG = {
  // Current Best Badges (only one person can hold these)
  CURRENT_BESTS: [
    { 
      id: 'current_win_streak', 
      name: '🔥 Streak King', 
      description: 'Current longest win streak',
      icon: '🔥', 
      color: '#FF6B35',
      category: 'current_best'
    },
    { 
      id: 'current_highest_day', 
      name: '🚀 Step Monster', 
      description: 'Current highest single day',
      icon: '🚀', 
      color: '#FFD700',
      category: 'current_best'
    },
    { 
      id: 'current_total_steps', 
      name: '👑 Total Champion', 
      description: 'Current highest total steps',
      icon: '👑', 
      color: '#9C27B0',
      category: 'current_best'
    }
  ],

  // Funny/Quirky Badges
  FUNNY_BADGES: [
    { 
      id: 'back_to_back_same', 
      name: '🔄 Déjà Vu', 
      description: 'Two consecutive days with exactly the same steps',
      icon: '🔄', 
      color: '#E91E63',
      category: 'funny'
    },
    { 
      id: 'lowest_day', 
      name: '🐌 Sloth Mode', 
      description: 'Lowest single day steps',
      icon: '🐌', 
      color: '#795548',
      category: 'funny'
    },
    { 
      id: 'palindrome_steps', 
      name: '🔄 Palindrome', 
      description: 'Steps that read the same forwards and backwards (e.g., 12321)',
      icon: '🔄', 
      color: '#00BCD4',
      category: 'funny'
    },
    { 
      id: 'lucky_seven', 
      name: '🍀 Lucky 7', 
      description: 'Steps ending in 777 (e.g., 12777, 20777)',
      icon: '🍀', 
      color: '#4CAF50',
      category: 'funny'
    },
    { 
      id: 'round_number', 
      name: '🎯 Bullseye', 
      description: 'Exactly 10,000, 15,000, or 20,000 steps',
      icon: '🎯', 
      color: '#FF9800',
      category: 'funny'
    },
    { 
      id: 'zero_day', 
      name: '😴 Sleep Day', 
      description: 'A day with 0 steps',
      icon: '😴', 
      color: '#9E9E9E',
      category: 'funny'
    },
    { 
      id: 'one_step', 
      name: '🦵 One Leg', 
      description: 'A day with exactly 1 step',
      icon: '🦵', 
      color: '#FF5722',
      category: 'funny'
    },
    { 
      id: 'repeating_pattern', 
      name: '🎵 Rhythm Master', 
      description: 'Steps with repeating digits (e.g., 12121, 99999)',
      icon: '🎵', 
      color: '#9C27B0',
      category: 'funny'
    }
  ],

  // Special Milestone Badges
  SPECIAL_MILESTONES: [
    { 
      id: 'first_win', 
      name: '🥇 First Victory', 
      description: 'First time winning a day',
      icon: '🥇', 
      color: '#FFD700',
      category: 'milestone'
    },
    { 
      id: 'weekend_warrior', 
      name: '🏈 Weekend Warrior', 
      description: 'Won both Saturday and Sunday in the same week',
      icon: '🏈', 
      color: '#FF6B35',
      category: 'milestone'
    },
    { 
      id: 'comeback_king', 
      name: '💪 Comeback King', 
      description: 'Won after being last the previous day',
      icon: '💪', 
      color: '#4CAF50',
      category: 'milestone'
    },
    { 
      id: 'consistency_master', 
      name: '📈 Consistency Master', 
      description: '7 consecutive days over 10K steps',
      icon: '📈', 
      color: '#2196F3',
      category: 'milestone'
    },
    { 
      id: 'speed_demon', 
      name: '⚡ Speed Demon', 
      description: 'Won 3 days in a row',
      icon: '⚡', 
      color: '#FF9800',
      category: 'milestone'
    },
    { 
      id: 'marathon_man', 
      name: '🏃 Marathon Man', 
      description: 'A day with 26,000+ steps (marathon distance)',
      icon: '🏃', 
      color: '#E91E63',
      category: 'milestone'
    },
    { 
      id: 'ultra_marathon', 
      name: '🏃‍♂️ Ultra Runner', 
      description: 'A day with 50,000+ steps',
      icon: '🏃‍♂️', 
      color: '#9C27B0',
      category: 'milestone'
    },
    { 
      id: 'perfect_week', 
      name: '⭐ Perfect Week', 
      description: 'Won every day in a week',
      icon: '⭐', 
      color: '#FFD700',
      category: 'milestone'
    }
  ]
}; 