# StepTracker

A gamified step tracking application with competitive features, analytics, and real-time data visualization.

## Features

- **Gamification**: Streaks, leaderboards, achievements, monthly champions
- **Analytics**: Interactive charts and performance metrics
- **Real-time Data**: Google Sheets integration
- **Responsive Design**: Works on desktop and mobile

## Quick Start

### Prerequisites
- Node.js 18+
- .NET 8.0 SDK
- Google Sheets API credentials

### Development

**Docker (Recommended):**
```bash
./docker/dev.sh start
```

**Manual:**
```bash
# Backend
cd backend
dotnet run

# Frontend  
cd frontend
npm install
npm run dev
```

## Configuration

**Backend** (`appsettings.Development.json`):
```json
{
  "GoogleSheets": {
    "ApiKey": "your_api_key",
    "SpreadsheetId": "your_spreadsheet_id"
  }
}
```

**Frontend** (`src/constants/index.js`):
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5120'
};
```

## Testing

```bash
dotnet test
```

## License

MIT License

---

**Happy stepping! 🏃‍♂️💨**
