# 🏃‍♂️ Step Brothers - Gamified Step Tracking App

A modern, gamified step tracking application built with React, Material-UI, and .NET 8. Track your daily steps, compete with friends, and celebrate achievements with an engaging gamification system.

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14.0-blue?style=for-the-badge&logo=mui)
![.NET](https://img.shields.io/badge/.NET-8.0-purple?style=for-the-badge&logo=dotnet)

## ✨ Features

- **Gamification System**: Win/losing streaks, monthly champions, all-time bests
- **Analytics & Visualization**: Interactive charts with real-time data from Google Sheets
- **Competitive Features**: Leaderboards, streak tracking, achievement badges
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Glassmorphism design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- .NET 8.0 SDK
- Google Sheets API credentials

### Docker Development (Recommended)

```bash
# Start development environment
./docker/dev.sh start

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:5120
```

### Manual Setup

**Backend:**
```bash
cd backend
dotnet restore
# Configure appsettings.Development.json with your Google Sheets credentials
dotnet run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

```bash
cd StepTracker.Tests
dotnet test
```

## 📁 Project Structure

```
StepTracker/
├── backend/                   # .NET 8 API
├── frontend/                  # React + Vite application
├── StepTracker.Tests/         # Test suite
└── docker/                    # Docker development environment
```

## 🔧 Configuration

### Backend (`appsettings.Development.json`)
```json
{
  "GoogleSheets": {
    "ApiKey": "your_api_key",
    "SpreadsheetId": "your_spreadsheet_id",
    "SheetRange": "Sheet1!A:Z"
  }
}
```

### Frontend (`src/constants/index.js`)
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5120'
};
```

## 🚀 Deployment

The application is configured for Azure deployment with GitHub Actions. See `.github/workflows/` for deployment configurations.

## 📝 License

This project is licensed under the MIT License.

---

**Happy stepping! 🏃‍♂️💨**
