// API Response Types
export interface StepDataResponse {
  participants: string[];
  dailyData: DailyStepEntry[];
  participantData: ParticipantData[];
  totals?: TotalsData;
}

export interface DailyStepEntry {
  day: string | number;
  steps: Record<string, number>;
  date?: string;
}

export interface ParticipantData {
  name: string;
  totalSteps: number;
  averageSteps: number;
  highestSingleDay: number;
  dailySteps: number[];
  currentStreak: number;
  bestStreak: number;
  wins: number;
  monthlyWins: number;
  allTimeWins?: number;
  currentLosingStreak?: number;
  bestLosingStreak?: number;
  consistencyScore?: number;
  lastActiveDate?: string;
}

export interface TotalsData {
  totalSteps: number;
  averageSteps: number;
  totalDays: number;
  activeParticipants: number;
}

export interface GamificationData {
  achievements: Achievement[];
  badges: Badge[];
  leaderboards: LeaderboardData;
  streaks: StreakData[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedBy?: string;
  unlockedDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'current_best' | 'funny' | 'achievement';
  holder?: string;
  unlockedDate?: string;
}

export interface LeaderboardData {
  current: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  name: string;
  value: number;
  rank: number;
  change?: number;
}

export interface StreakData {
  name: string;
  currentStreak: number;
  bestStreak: number;
  type: 'win' | 'lose';
  lastActive: string;
}

// Hook Types
export interface UseStepsDataOptions {
  tab?: string;
  totals?: boolean;
  gamification?: boolean;
  person?: string | null;
  fromDate?: Date;
}

export interface UseStepsDataReturn {
  data: StepDataResponse | GamificationData | ParticipantData | TotalsData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

// Component Props Types
export interface NavBarProps {
  people: string[];
}

export interface DashboardProps {
  className?: string;
}

export interface PersonPageProps {
  className?: string;
}

export interface GamificationPageProps {
  className?: string;
}

export interface LeaderboardProps {
  data: LeaderboardEntry[];
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
}

export interface StepLineChartProps {
  data: DailyStepEntry[];
  participants: string[];
  height?: number;
  loading?: boolean;
  error?: string | null;
}

export interface CumulativeStepsChartProps {
  data: DailyStepEntry[];
  participants: string[];
  height?: number;
  loading?: boolean;
  error?: string | null;
}

export interface WeeklyPerformanceChartProps {
  data: DailyStepEntry[];
  participants: string[];
  height?: number;
  loading?: boolean;
  error?: string | null;
}

export interface ConsistencyHeatmapProps {
  data: DailyStepEntry[];
  participants: string[];
  height?: number;
  loading?: boolean;
  error?: string | null;
}

export interface BadgesSectionProps {
  badges: Badge[];
  loading?: boolean;
  error?: string | null;
}

export interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

export interface StreakCardProps {
  participant: ParticipantData;
  loading?: boolean;
}

// Store Types
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  modal: ModalState | null;
  snackbar: SnackbarState | null;
}

export interface ModalState {
  type: string;
  props?: Record<string, unknown>;
}

export interface SnackbarState {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Utility Types
export type ChartColor = string;
export type ParticipantName = string;
export type DateString = string;
export type StepCount = number;

// API Error Types
export interface APIError {
  message: string;
  status: number;
  code?: string;
}

// Configuration Types
export interface ChartConfig {
  colors: ChartColor[];
  height: number;
  margin: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  };
}

export interface StreakConfig {
  goldThreshold: number;
  orangeThreshold: number;
  colors: {
    gold: string;
    orange: string;
    green: string;
    red: string;
  };
}

// Event Types
export interface ChartClickEvent {
  active: Array<{
    payload: Record<string, unknown>;
    dataKey: string;
  }>;
}

// Form Types
export interface DateRangeForm {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FilterForm {
  participants: string[];
  dateRange: DateRangeForm;
  minSteps?: number;
  maxSteps?: number;
} 