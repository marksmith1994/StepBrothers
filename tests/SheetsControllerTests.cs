using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using StepTracker.Controllers;
using StepTracker.Services;
using StepTracker.Models;
using Xunit;
using System.Collections.Generic;

namespace StepTracker.Tests
{
    public class SheetsControllerTests
    {
        private readonly Mock<IConfiguration> _mockConfiguration;

        public SheetsControllerTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
        }

        [Fact]
        public void Constructor_WithValidConfiguration_CreatesController()
        {
            // Arrange
            SetupMockConfiguration();

            // Act & Assert
            var controller = new SheetsController(_mockConfiguration.Object);
            Assert.NotNull(controller);
        }

        private void SetupMockConfiguration()
        {
            var mockConfigSection = new Mock<IConfigurationSection>();
            mockConfigSection.Setup(x => x.Value).Returns("test_value");

            _mockConfiguration.Setup(x => x["GoogleSheets:ApiKey"]).Returns("test_api_key");
            _mockConfiguration.Setup(x => x["GoogleSheets:SpreadsheetId"]).Returns("test_spreadsheet_id");
            _mockConfiguration.Setup(x => x["GoogleSheets:SheetRange"]).Returns("test_sheet_range");
        }
    }
} 