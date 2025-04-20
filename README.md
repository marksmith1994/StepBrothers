# StepBrothers

StepBrothers is a step-tracking dashboard for multiple users, featuring a modern responsive UI, beautiful charts, and both web and native mobile app support.

## Features
- **Dashboard**: View step data for all users in a clean, wide layout with interactive tables and charts.
- **NavBar**: Enhanced navigation with a visually appealing, gradient-styled NavBar.
- **Mobile App Ready**: The frontend can be wrapped as a native Android/iOS app using Capacitor.
- **Wider Layout**: The app now supports much larger screens (up to 1800px wide) for better data visibility.
- **Modern Material-UI**: Uses MUI for consistent, accessible design.

## Getting Started

### Web (Dockerized)
1. Clone the repository.
2. Run your backend and frontend using Docker Compose:
   ```sh
   docker-compose up --build
   ```
3. Access the app at [http://localhost:3000](http://localhost:3000)

### Native Mobile App (Android/iOS)
1. Build the frontend:
   ```sh
   cd frontend
   npm run build
   ```
2. Install Capacitor and initialize:
   ```sh
   npm install @capacitor/core @capacitor/cli
   npx cap init StepBrothers com.mark.stepbrothers --web-dir=dist
   npx cap add android
   # (On Mac, also: npx cap add ios)
   npx cap copy
   npx cap open android
   # (Or: npx cap open ios)
   ```
3. Run and test in Android Studio or Xcode.

## Data Format
- The app expects step data in CSV format, with each row representing a day or month.
- Example daily CSV:
  ```csv
  Date,Mark,John,Total
  2025-01-01,123,234,357
  2025-01-02,150,220,370
  ```

## Customization
- Adjust the dashboard/table width in `frontend/src/App.css` (`#root { max-width: 1800px; }`).
- NavBar and dashboard UI are fully responsive and can be themed via Material-UI.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
