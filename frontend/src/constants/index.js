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
    { label: '🏅 Monthly Champions', value: 3 },
    { label: '⭐ All-Time Bests', value: 4 }
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