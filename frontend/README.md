# StepTracker Frontend

The frontend application for StepTracker, built with React, Vite, and Material-UI. This application provides a modern, gamified interface for tracking daily steps and competing with friends.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend should be running at: http://localhost:5120

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AchievementCard.jsx
│   │   ├── AllTimeBestsTable.jsx
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── ConsistencyHeatmap.jsx
│   │   ├── CumulativeStepsChart.jsx
│   │   ├── Footer.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── MonthlyWinnersTable.jsx
│   │   ├── NavBar.jsx
│   │   ├── PersonPageSkeleton.jsx
│   │   ├── StepLineChart.jsx
│   │   ├── StreakCard.jsx
│   │   └── WeeklyPerformanceChart.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── GamificationPage.jsx
│   │   └── PersonPage.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useStepsData.js
│   ├── utils/               # Utility functions
│   │   ├── achievements.js
│   │   ├── analytics.js
│   │   ├── cache.js
│   │   └── helpers.js
│   ├── constants/           # Application constants
│   │   └── index.js
│   ├── styles/              # CSS styles
│   │   └── common.css
│   ├── theme.js             # Material-UI theme configuration
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## 🎨 UI Components

### Core Components
- **Dashboard**: Main overview with leaderboards and recent activity
- **GamificationPage**: Achievement tracking and gamification features
- **PersonPage**: Individual participant statistics and progress

### Data Visualization
- **StepLineChart**: Daily step progress visualization
- **CumulativeStepsChart**: Long-term progress tracking
- **ConsistencyHeatmap**: Visual representation of daily consistency
- **WeeklyPerformanceChart**: Weekly performance analysis

### Gamification Elements
- **StreakCard**: Current win/losing streak display
- **AchievementCard**: Achievement badges and progress
- **Leaderboard**: Competitive rankings
- **MonthlyWinnersTable**: Monthly champion tracking
- **AllTimeBestsTable**: Record-breaking performances

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_URL=http://localhost:5120
```

### API Configuration

The application communicates with the backend API through the configuration in `src/constants/index.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5120',
  ENDPOINTS: {
    SHEETS_DATA: '/api/sheets/data',
    SHEETS_TOTALS: '/api/sheets/totals',
    SHEETS_GAMIFICATION: '/api/sheets/gamification',
    SHEETS_PARTICIPANT: '/api/sheets/participant',
    SHEETS_TABS: '/api/sheets/tabs'
  }
};
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f97316)
- **Error**: Red (#ef4444)
- **Gold**: Achievement color (#fbbf24)

### Typography
- **Headings**: Bold, gradient text with proper hierarchy
- **Body Text**: Clean, readable fonts
- **Icons**: Material-UI icons with consistent styling

### Components
- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Fade-in effects and hover transitions
- **Responsive Layout**: Mobile-first design approach

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your hosting provider

## 🔧 Development Tools

- **Vite**: Fast build tool and development server
- **React**: UI framework
- **Material-UI**: Component library
- **Recharts**: Data visualization library
- **ESLint**: Code linting

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new functionality
3. Ensure all components are responsive
4. Update documentation as needed

## 📄 License

This project is part of the StepTracker application. See the main README for license information.
