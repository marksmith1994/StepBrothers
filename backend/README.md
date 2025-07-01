# StepTracker Backend

A professional, well-structured ASP.NET Core Web API for tracking step data with gamification features.

## Architecture Overview

The backend follows clean architecture principles with proper separation of concerns:

### Project Structure

```
backend/
├── Controllers/           # API Controllers (RESTful endpoints)
├── Interfaces/           # Service interfaces for dependency injection
├── Models/              # Data models and DTOs
├── Services/            # Business logic services
├── Extensions/          # Extension methods for mapping and utilities
└── Program.cs           # Application entry point and DI configuration
```

### Key Components

#### Controllers
- **StepsController**: RESTful endpoints for step data operations
  - `GET /api/steps` - Get all step data with optional filtering
  - `GET /api/steps/participants/{name}` - Get participant-specific data
  - `GET /api/steps/totals` - Get total steps for all participants
  - `GET /api/steps/gamification` - Get gamification data

- **SheetsController**: Google Sheets integration endpoints
  - `GET /api/sheets/tabs` - Get available sheet tabs
  - `GET /api/sheets/raw` - Get raw sheet data

#### Services
- **IStepDataService/StepDataService**: Handles step data parsing, filtering, and calculations
- **IGamificationService/GamificationService**: Manages gamification features (winners, streaks, achievements)
- **IGoogleSheetsService/GoogleSheetsService**: Google Sheets API integration

#### Models
- **StepEntry**: Individual day step data
- **ParticipantData**: Participant statistics and achievements
- **StepDataResponse**: Complete step data response
- **GamificationModels**: Monthly winners, all-time bests, cumulative data, streaks

#### Extensions
- **StepDataExtensions**: Extension methods for data mapping and transformations

## Features

### Core Functionality
- Parse Google Sheets data into structured step data
- Filter data by month and year
- Calculate participant statistics (totals, averages, streaks)
- Support for multiple participants

### Gamification Features
- Monthly winners calculation
- All-time best performances
- Cumulative step tracking
- Current win/loss streaks
- Achievement tracking

### API Features
- RESTful endpoints following best practices
- Proper error handling and status codes
- CORS configuration for frontend integration
- Dependency injection for testability

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Google Sheets API credentials

### Configuration
Update `appsettings.json` with your Google Sheets configuration:

```json
{
  "GoogleSheets": {
    "ApiKey": "your-api-key",
    "SpreadsheetId": "your-spreadsheet-id",
    "SheetRange": "your-sheet-range"
  }
}
```

### Running the Application
```bash
cd backend
dotnet run
```

The API will be available at `https://localhost:7001` (or your configured port).

## Testing

### Running Tests
```bash
cd tests
dotnet test
```

### Test Coverage
- **Unit Tests**: Individual service and component testing
- **Integration Tests**: Controller and API endpoint testing
- **Mock Testing**: Using Moq for dependency isolation

### Test Structure
- `StepDataServiceTests.cs` - Step data processing logic
- `GamificationServiceTests.cs` - Gamification calculations
- `GoogleSheetsServiceTests.cs` - Google Sheets integration
- `StepsControllerTests.cs` - API endpoint integration tests

## Best Practices Implemented

### Code Quality
- **Interface Segregation**: Each service has a focused interface
- **Dependency Injection**: All services are properly injected
- **Single Responsibility**: Each class has a single, well-defined purpose
- **Extension Methods**: Clean data transformation utilities

### API Design
- **RESTful Endpoints**: Following REST conventions
- **Proper HTTP Status Codes**: 200, 404, 500, etc.
- **Consistent Error Responses**: Standardized error format
- **Documentation**: XML comments for API documentation

### Testing
- **High Test Coverage**: Comprehensive unit and integration tests
- **Mock Dependencies**: Isolated testing with Moq
- **Test Data**: Realistic test scenarios
- **Assertion Quality**: Meaningful test assertions

## Future Enhancements

### Potential Improvements
- **Caching**: Implement response caching for better performance
- **Validation**: Add request validation using FluentValidation
- **Logging**: Structured logging with Serilog
- **Metrics**: Application metrics and monitoring
- **Database**: Move from Google Sheets to a proper database
- **Authentication**: Add user authentication and authorization

### Scalability Considerations
- **Async/Await**: All I/O operations are asynchronous
- **Memory Efficiency**: Proper disposal of resources
- **Performance**: Optimized data processing algorithms
- **Modularity**: Easy to extend with new features

## Contributing

1. Follow the existing code structure and patterns
2. Add unit tests for new functionality
3. Update documentation for API changes
4. Ensure all tests pass before submitting

## License

This project is part of the StepTracker application. 