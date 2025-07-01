using Microsoft.AspNetCore.Mvc;
using Moq;
using StepTracker.Controllers;
using StepTracker.Interfaces;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StepTracker.Tests
{
    public class SheetsControllerTests
    {
        private readonly Mock<IGoogleSheetsService> _mockSheetsService;
        private readonly SheetsController _controller;

        public SheetsControllerTests()
        {
            _mockSheetsService = new Mock<IGoogleSheetsService>();
            _controller = new SheetsController(_mockSheetsService.Object);
        }

        [Fact]
        public void Constructor_WithValidService_CreatesController()
        {
            Assert.NotNull(_controller);
        }

        [Fact]
        public async Task GetSheetTabs_ReturnsOkResultWithTabs()
        {
            // Arrange
            var tabs = new List<string> { "Tab1", "Tab2" };
            _mockSheetsService.Setup(s => s.GetSheetNamesAsync()).ReturnsAsync(tabs);

            // Act
            var result = await _controller.GetSheetTabs();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTabs = Assert.IsType<List<string>>(okResult.Value);
            Assert.Equal(2, returnedTabs.Count);
            Assert.Contains("Tab1", returnedTabs);
        }
    }
} 