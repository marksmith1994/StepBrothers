using System.Collections.Generic;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using StepTracker.Controllers;
using StepTracker.Interfaces;
using StepTracker.Models;

namespace StepTracker.Tests
{
    public class StepsControllerTests
    {
        private readonly Mock<IGoogleSheetsService> _mockSheetsService;
        private readonly Mock<IStepDataService> _mockStepDataService;
        private readonly Mock<IGamificationService> _mockGamificationService;
        private readonly StepsController _controller;

        private readonly List<IList<object>> sampleRawData = new()
        {
            new List<object> { "Mark", "John", "Sarah" },
            new List<object> { "1000", "2000", "1500" },
            new List<object> { "1500", "2500", "1200" }
        };

        private readonly StepDataResponse sampleStepData = new()
        {
            Participants = new List<string> { "Mark", "John", "Sarah" },
            DailyData = new List<StepEntry>
            {
                new StepEntry { Day = 1, Steps = new Dictionary<string, int> { { "Mark", 1000 }, { "John", 2000 }, { "Sarah", 1500 } }, Total = 4500 },
                new StepEntry { Day = 2, Steps = new Dictionary<string, int> { { "Mark", 1500 }, { "John", 2500 }, { "Sarah", 1200 } }, Total = 5200 }
            },
            ParticipantData = new List<ParticipantData>
            {
                new ParticipantData { Name = "Mark", TotalSteps = 2500, AverageSteps = 1250 },
                new ParticipantData { Name = "John", TotalSteps = 4500, AverageSteps = 2250 },
                new ParticipantData { Name = "Sarah", TotalSteps = 2700, AverageSteps = 1350 }
            }
        };

        public StepsControllerTests()
        {
            _mockSheetsService = new Mock<IGoogleSheetsService>();
            _mockStepDataService = new Mock<IStepDataService>();
            _mockGamificationService = new Mock<IGamificationService>();
            
            _controller = new StepsController(_mockSheetsService.Object, _mockStepDataService.Object, _mockGamificationService.Object);
        }

        [Fact]
        public async Task GetStepData_WithValidData_ReturnsOkResult()
        {
            // Arrange
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ReturnsAsync(sampleRawData);
            _mockStepDataService.Setup(s => s.ParseStepsData(sampleRawData, null, null)).Returns(sampleStepData);

            // Act
            var result = await _controller.GetStepData();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<StepDataResponse>(okResult.Value);
            Assert.Equal(3, response.Participants.Count);
            Assert.Equal(2, response.DailyData.Count);
        }

        [Fact]
        public async Task GetStepData_WithNoData_ReturnsNotFound()
        {
            // Arrange
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ReturnsAsync(new List<IList<object>>());

            // Act
            var result = await _controller.GetStepData();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetStepData_WithException_ReturnsInternalServerError()
        {
            // Arrange
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.GetStepData();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task GetParticipantData_WithValidParticipant_ReturnsOkResult()
        {
            // Arrange
            var participantName = "Mark";
            var participantData = sampleStepData.ParticipantData.First(p => p.Name == participantName);
            
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ReturnsAsync(sampleRawData);
            _mockStepDataService.Setup(s => s.ParseStepsData(sampleRawData, null, null)).Returns(sampleStepData);

            // Act
            var result = await _controller.GetParticipantData(participantName);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ParticipantData>(okResult.Value);
            Assert.Equal(participantName, response.Name);
            Assert.Equal(2500, response.TotalSteps);
        }

        [Fact]
        public async Task GetParticipantData_WithNonExistentParticipant_ReturnsNotFound()
        {
            // Arrange
            var participantName = "NonExistent";
            
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ReturnsAsync(sampleRawData);
            _mockStepDataService.Setup(s => s.ParseStepsData(sampleRawData, null, null)).Returns(sampleStepData);

            // Act
            var result = await _controller.GetParticipantData(participantName);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetTotals_WithValidData_ReturnsOkResult()
        {
            // Arrange
            var totals = new Dictionary<string, int> { { "Mark", 2500 }, { "John", 4500 }, { "Sarah", 2700 } };
            
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ReturnsAsync(sampleRawData);
            _mockStepDataService.Setup(s => s.ParseStepsData(sampleRawData, null, null)).Returns(sampleStepData);
            _mockStepDataService.Setup(s => s.GetTotals(sampleStepData.DailyData)).Returns(totals);

            // Act
            var result = await _controller.GetTotals();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<Dictionary<string, int>>(okResult.Value);
            Assert.Equal(3, response.Count);
            Assert.Equal(2500, response["Mark"]);
        }

        [Fact]
        public async Task GetGamificationData_WithValidData_ReturnsOkResult()
        {
            // Arrange
            var gamificationData = new GamificationData
            {
                MonthlyWinners = new List<MonthlyWinner>(),
                AllTimeBests = new List<AllTimeBest>(),
                CumulativeData = new List<CumulativeData>(),
                CurrentStreaks = new Dictionary<string, int>()
            };
            
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ReturnsAsync(sampleRawData);
            _mockStepDataService.Setup(s => s.ParseStepsData(sampleRawData, null, null)).Returns(sampleStepData);
            _mockGamificationService.Setup(s => s.CalculateGamificationData(sampleStepData.DailyData, sampleStepData.Participants)).Returns(gamificationData);

            // Act
            var result = await _controller.GetGamificationData();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<GamificationData>(okResult.Value);
            Assert.NotNull(response);
        }

        [Fact]
        public async Task GetStepData_WithFiltering_AppliesFilters()
        {
            // Arrange
            var tab = "January";
            var year = 2025;
            
            _mockSheetsService.Setup(s => s.GetSheetDataAsync()).ReturnsAsync(sampleRawData);
            _mockStepDataService.Setup(s => s.ParseStepsData(sampleRawData, tab, year)).Returns(sampleStepData);

            // Act
            var result = await _controller.GetStepData(tab, year);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            _mockStepDataService.Verify(s => s.ParseStepsData(sampleRawData, tab, year), Times.Once);
        }
    }
} 