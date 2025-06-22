# 🏃‍♂️ Step Brothers - Gamified Step Tracking App

A modern, gamified step tracking application built with React, Material-UI, and .NET Core. Track your daily steps, compete with friends, and celebrate achievements with an engaging gamification system.

![Step Brothers App](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14.0-blue?style=for-the-badge&logo=mui)
![.NET Core](https://img.shields.io/badge/.NET-7.0-purple?style=for-the-badge&logo=dotnet)

## ✨ Features

### 🏆 Gamification System
- **Win/Losing Streaks**: Track consecutive days of winning or losing
- **Monthly Champions**: Monthly leaderboards with winners
- **All-Time Bests**: Record-breaking single-day performances
- **Achievement Stats**: Comprehensive achievement tracking
- **Cumulative Progress**: Visual progress tracking over time

### 📊 Analytics & Visualization
- **Interactive Charts**: Beautiful step progress visualizations
- **Real-time Data**: Live updates from Google Sheets integration
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Glassmorphism design with smooth animations

### 🎮 Competitive Features
- **Leaderboards**: Overall and monthly rankings
- **Streak Tracking**: Current and best win streaks
- **Performance Metrics**: Detailed statistics for each participant
- **Achievement Badges**: Visual recognition for accomplishments

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- .NET 7.0 SDK
- Google Sheets API credentials
- **Docker Desktop** (for Docker development)

## 🐳 Docker Development (Recommended)

The easiest way to get started is using Docker with hot reloading and file watching:

### Quick Start with Docker

1. **Start the development environment**:
   ```bash
   # Make the script executable (first time only)
   chmod +x docker/dev.sh
   
   # Start development environment
   ./docker/dev.sh start
   ```

2. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5120

3. **Start coding!** 
   - File changes will automatically trigger hot reloads
   - No need to restart containers manually

### Development Commands

```bash
# All commands use the single dev.sh script
./docker/dev.sh start          # Start development environment
./docker/dev.sh stop           # Stop development environment
./docker/dev.sh restart        # Restart services
./docker/dev.sh logs           # View all logs
./docker/dev.sh frontend-logs  # View frontend logs only
./docker/dev.sh backend-logs   # View backend logs only
./docker/dev.sh rebuild        # Rebuild containers
./docker/dev.sh clean          # Clean up everything
./docker/dev.sh status         # Check service status
./docker/dev.sh help           # Show all commands
```

### Docker Features
- ✅ **Hot Reloading**: Frontend and backend automatically reload on file changes
- ✅ **File Watching**: Optimized for Windows with polling enabled
- ✅ **Volume Mounting**: Your local files are mounted into containers
- ✅ **Development Optimized**: Separate development Dockerfiles with debugging enabled
- ✅ **Network Isolation**: Dedicated development network
- ✅ **Persistent Data**: Node modules and build artifacts are cached
- ✅ **Cross-platform**: Single script works on Windows, macOS, and Linux

## 🔧 Manual Setup (Alternative)

### Prerequisites
- Node.js (v16 or higher)
- .NET 7.0 SDK
- Google Sheets API credentials

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   dotnet restore
   ```

3. **Configure Google Sheets**:
   - Create a Google Cloud Project
   - Enable Google Sheets API
   - Create service account credentials
   - Share your Google Sheet with the service account email
   - Update `appsettings.json` with your credentials

4. **Run the backend**:
   ```bash
   dotnet run
   ```

The backend will be available at `http://localhost:5120`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
StepTracker/
├── backend/
│   ├── Controllers/
│   │   └── SheetsController.cs
│   ├── Models/
│   │   └── StepEntry.cs
│   ├── Services/
│   │   └── StepService.cs
│   └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StreakCard.jsx
│   │   │   ├── MonthlyWinnersTable.jsx
│   │   │   ├── AllTimeBestsTable.jsx
│   │   │   ├── CumulativeStepsChart.jsx
│   │   │   └── NavBar.jsx
│   │   ├── pages/
│   │   │   ├── GamificationPage.jsx
│   │   │   ├── PersonPage.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/
│   │   │   └── useStepsData.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── constants/
│   │   │   └── index.js
│   │   ├── theme.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🎨 UI/UX Features

### Modern Design System
- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Fade-in effects and hover transitions
- **Responsive Layout**: Mobile-first design approach

### Color Scheme
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f97316)
- **Error**: Red (#ef4444)
- **Gold**: Achievement color (#fbbf24)

### Typography
- **Headings**: Bold, gradient text with proper hierarchy
- **Body Text**: Clean, readable fonts
- **Icons**: Material-UI icons with consistent styling

## 🔧 Configuration

### Backend Configuration (`appsettings.json`)
```json
{
  "GoogleSheets": {
    "SpreadsheetId": "your-spreadsheet-id",
    "CredentialsPath": "path/to/credentials.json"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

### Frontend Configuration (`src/constants/index.js`)
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5120',
  ENDPOINTS: {
    SHEETS_DATA: '/api/sheets/data',
    SHEETS_GAMIFICATION: '/api/sheets/gamification'
  }
};
```

## 📊 Data Structure

### Google Sheets Format
Your Google Sheet should have the following structure:
- **Row 1**: Headers (Date, Person1, Person2, etc.)
- **Column A**: Dates
- **Columns B+**: Step counts for each person

### API Endpoints
- `GET /api/sheets/data` - Raw step data
- `GET /api/sheets/totals` - Aggregated totals
- `GET /api/sheets/gamification` - Gamification data
- `GET /api/sheets/participant/{name}` - Individual participant data

## 🎯 Gamification Rules

### Win Streaks
- **Gold Streak**: 7+ consecutive wins
- **Orange Streak**: 3-6 consecutive wins
- **Green Streak**: 1-2 consecutive wins

### Monthly Champions
- Winner determined by highest total steps in the month
- Ties broken by number of days tracked
- Special recognition for current month

### All-Time Bests
- Top 10 single-day performances
- Gold, silver, bronze medals for top 3
- Historical record tracking

## 🚀 Production Deployment

### Frontend Deployment

1. **Set up environment variables**:
   ```bash
   cd frontend
   cp .env.production.template .env.production
   # Edit .env.production with your backend URL
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Deploy the `dist` folder** to your hosting provider (Netlify, Vercel, etc.)

### Backend Deployment

1. **Set up environment variables** on your hosting platform:
   - `GOOGLE_SHEETS_API_KEY`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_SHEET_RANGE`

2. **Deploy to your hosting provider** (Azure, AWS, etc.)

### Environment Variables

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com
```

#### Backend
```env
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_SHEET_RANGE=dashboard!C2:G367
```

## 🧹 Production Checklist

- [ ] Remove all `console.log` statements
- [ ] Set up proper environment variables
- [ ] Configure CORS for production domains
- [ ] Set up proper error handling
- [ ] Test all features in production environment
- [ ] Set up monitoring and logging
- [ ] Configure SSL certificates
- [ ] Set up backup strategy for Google Sheets data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material-UI for the component library
- React for the frontend framework
- .NET Core for the backend framework
- Google Sheets API for data storage

## 📞 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Happy stepping! 🏃‍♂️💨**

## Setup Instructions

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- Google Sheets API access

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd StepTracker
   ```

2. **Configure Google Sheets API**
   - Create a Google Cloud Project
   - Enable Google Sheets API
   - Create API credentials (API Key)
   - Share your Google Sheet with the API

3. **Configure Backend**
   ```bash
   cd backend
   cp appsettings.template.json appsettings.Development.json
   ```
   
   Edit `appsettings.Development.json` with your actual values:
   ```json
   {
     "GoogleSheets": {
       "ApiKey": "your_actual_api_key",
       "SpreadsheetId": "your_spreadsheet_id",
       "SheetRange": "Sheet1!A:Z"
     }
   }
   ```

4. **Run the Backend**
   ```bash
   dotnet run
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Security Notes

- Never commit `appsettings.Development.json` or any files containing API keys
- The `.gitignore` file is configured to exclude sensitive files
- Use environment variables for production deployments
- Keep your Google API key secure and restrict it to your domain

## Project Structure

```
StepTracker/
├── backend/                 # .NET API
│   ├── Controllers/         # API endpoints
│   ├── Services/           # Business logic
│   └── Models/             # Data models
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS styles
│   └── public/             # Static assets
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for personal use. Please respect the privacy of step data.
