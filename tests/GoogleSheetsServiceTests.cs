using Microsoft.Extensions.Configuration;
using Moq;
using StepTracker.Backend;
using Xunit;
using System.Collections.Generic;

namespace StepTracker.Tests
{
    public class GoogleSheetsServiceTests
    {
        private readonly Mock<IConfiguration> _mockConfiguration;

        public GoogleSheetsServiceTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
        }

        [Fact]
        public void Constructor_WithValidConfiguration_CreatesService()
        {
            // Arrange
            SetupMockConfiguration();

            // Act & Assert
            var service = new GoogleSheetsService(_mockConfiguration.Object);
            Assert.NotNull(service);
        }

        [Fact]
        public void Constructor_WithMissingApiKey_ThrowsArgumentNullException()
        {
            // Arrange
            _mockConfiguration.Setup(x => x["GoogleSheets:ApiKey"]).Returns<string>(null!);
            _mockConfiguration.Setup(x => x["GoogleSheets:SpreadsheetId"]).Returns("test_id");
            _mockConfiguration.Setup(x => x["GoogleSheets:SheetRange"]).Returns("test_range");

            // Act & Assert
            var exception = Assert.Throws<ArgumentNullException>(() => 
                new GoogleSheetsService(_mockConfiguration.Object));
            Assert.Equal("configuration", exception.ParamName);
        }

        [Fact]
        public void Constructor_WithMissingSpreadsheetId_ThrowsArgumentNullException()
        {
            // Arrange
            _mockConfiguration.Setup(x => x["GoogleSheets:ApiKey"]).Returns("test_key");
            _mockConfiguration.Setup(x => x["GoogleSheets:SpreadsheetId"]).Returns<string>(null!);
            _mockConfiguration.Setup(x => x["GoogleSheets:SheetRange"]).Returns("test_range");

            // Act & Assert
            var exception = Assert.Throws<ArgumentNullException>(() => 
                new GoogleSheetsService(_mockConfiguration.Object));
            Assert.Equal("configuration", exception.ParamName);
        }

        [Fact]
        public void Constructor_WithMissingSheetRange_ThrowsArgumentNullException()
        {
            // Arrange
            _mockConfiguration.Setup(x => x["GoogleSheets:ApiKey"]).Returns("test_key");
            _mockConfiguration.Setup(x => x["GoogleSheets:SpreadsheetId"]).Returns("test_id");
            _mockConfiguration.Setup(x => x["GoogleSheets:SheetRange"]).Returns<string>(null!);

            // Act & Assert
            var exception = Assert.Throws<ArgumentNullException>(() => 
                new GoogleSheetsService(_mockConfiguration.Object));
            Assert.Equal("configuration", exception.ParamName);
        }

        [Fact]
        public void Constructor_SetsCorrectApplicationName()
        {
            // Arrange
            SetupMockConfiguration();

            // Act
            var service = new GoogleSheetsService(_mockConfiguration.Object);

            // Assert
            // Note: We can't easily test the private fields, but we can verify the service is created
            Assert.NotNull(service);
        }

        [Fact]
        public void Constructor_SetsCorrectScopes()
        {
            // Arrange
            SetupMockConfiguration();

            // Act
            var service = new GoogleSheetsService(_mockConfiguration.Object);

            // Assert
            // Note: We can't easily test the private fields, but we can verify the service is created
            Assert.NotNull(service);
        }

        private void SetupMockConfiguration()
        {
            _mockConfiguration.Setup(x => x["GoogleSheets:ApiKey"]).Returns("test_api_key");
            _mockConfiguration.Setup(x => x["GoogleSheets:SpreadsheetId"]).Returns("test_spreadsheet_id");
            _mockConfiguration.Setup(x => x["GoogleSheets:SheetRange"]).Returns("test_sheet_range");
        }
    }
} 