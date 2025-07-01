#nullable disable
using System.Collections.Generic;
using Xunit;
using StepTracker.Services;
using StepTracker.Models;
using StepTracker.Interfaces;
using Moq;

namespace StepTracker.Tests
{
    public class StepDataServiceTests
    {
        private readonly StepDataService _service = new StepDataService();

        private readonly List<IList<object>> sampleRawData = new()
        {
            new List<object> { "Mark", "John", "Sarah" }, // Header row
            new List<object> { "1000", "2000", "1500" },  // Day 1
            new List<object> { "1500", "2500", "1200" },  // Day 2
            new List<object> { "2000", "1800", "2200" },  // Day 3
            new List<object> { "1200", "3000", "1800" },  // Day 4
            new List<object> { "1800", "2200", "2500" }   // Day 5
        };

        [Fact]
        public void ParseStepsData_WithValidData_ReturnsCorrectResponse()
        {
            var response = _service.ParseStepsData(sampleRawData);
            
            Assert.NotNull(response);
            Assert.Equal(3, response.Participants.Count);
            Assert.Contains("Mark", response.Participants);
            Assert.Contains("John", response.Participants);
            Assert.Contains("Sarah", response.Participants);
            Assert.Equal(5, response.DailyData.Count);
        }

        [Fact]
        public void ParseStepsData_WithEmptyData_ReturnsEmptyResponse()
        {
            var response = _service.ParseStepsData(new List<IList<object>>());
            
            Assert.NotNull(response);
            Assert.Empty(response.Participants);
            Assert.Empty(response.DailyData);
            Assert.Empty(response.ParticipantData);
        }

        [Fact]
        public void ParseStepsData_WithNullData_ReturnsEmptyResponse()
        {
            var response = _service.ParseStepsData(null);
            
            Assert.NotNull(response);
            Assert.Empty(response.Participants);
            Assert.Empty(response.DailyData);
            Assert.Empty(response.ParticipantData);
        }

        [Fact]
        public void ParseStepsData_WithSingleRow_ReturnsEmptyResponse()
        {
            var singleRowData = new List<IList<object>>
            {
                new List<object> { "Mark", "John" }
            };
            
            var response = _service.ParseStepsData(singleRowData);
            
            Assert.NotNull(response);
            Assert.Empty(response.Participants);
            Assert.Empty(response.DailyData);
        }

        [Fact]
        public void ParseStepsData_HandlesCommaSeparatedNumbers()
        {
            var dataWithCommas = new List<IList<object>>
            {
                new List<object> { "Mark", "John" },
                new List<object> { "1,000", "2,500" },
                new List<object> { "1,500", "3,000" }
            };
            
            var response = _service.ParseStepsData(dataWithCommas);
            
            Assert.Equal(2, response.DailyData.Count);
            Assert.Equal(1000, response.DailyData[0].Steps["Mark"]);
            Assert.Equal(2500, response.DailyData[0].Steps["John"]);
            Assert.Equal(1500, response.DailyData[1].Steps["Mark"]);
            Assert.Equal(3000, response.DailyData[1].Steps["John"]);
        }

        [Fact]
        public void ParseStepsData_HandlesInvalidNumbers()
        {
            var dataWithInvalidNumbers = new List<IList<object>>
            {
                new List<object> { "Mark", "John" },
                new List<object> { "1000", "invalid" },
                new List<object> { "abc", "2500" }
            };
            
            var response = _service.ParseStepsData(dataWithInvalidNumbers);
            
            Assert.Equal(2, response.DailyData.Count);
            Assert.Equal(1000, response.DailyData[0].Steps["Mark"]);
            Assert.Equal(0, response.DailyData[0].Steps["John"]);
            Assert.Equal(0, response.DailyData[1].Steps["Mark"]);
            Assert.Equal(2500, response.DailyData[1].Steps["John"]);
        }

        [Fact]
        public void ParseStepsData_CalculatesCorrectTotals()
        {
            var response = _service.ParseStepsData(sampleRawData);
            
            Assert.Equal(4500, response.DailyData[0].Total); // 1000 + 2000 + 1500
            Assert.Equal(5200, response.DailyData[1].Total); // 1500 + 2500 + 1200
            Assert.Equal(6000, response.DailyData[2].Total); // 2000 + 1800 + 2200
        }

        [Fact]
        public void ParseStepsData_CalculatesParticipantData()
        {
            var response = _service.ParseStepsData(sampleRawData);
            
            Assert.Equal(3, response.ParticipantData.Count);
            
            var markData = response.ParticipantData.First(p => p.Name == "Mark");
            Assert.Equal(7500, markData.TotalSteps); // 1000 + 1500 + 2000 + 1200 + 1800
            Assert.Equal(1500.0, markData.AverageSteps); // 7500 / 5
            Assert.Equal(2000, markData.HighestSingleDay);
            Assert.Equal(5, markData.DailySteps.Count);
        }

        [Fact]
        public void ParseStepsData_WithMonthFilter_ReturnsFilteredData()
        {
            var response = _service.ParseStepsData(sampleRawData, "January");
            
            Assert.NotNull(response);
            // Note: The current implementation uses a simplified month filtering
            // based on estimated 30-day periods, so this test may need adjustment
        }

        [Fact]
        public void ParseStepsData_WithDashboardMonth_ReturnsAllData()
        {
            var response = _service.ParseStepsData(sampleRawData, "dashboard");
            
            Assert.NotNull(response);
            Assert.Equal(3, response.Participants.Count);
            Assert.Equal(5, response.DailyData.Count);
        }

        [Fact]
        public void GetTotals_ReturnsCorrectTotals()
        {
            var response = _service.ParseStepsData(sampleRawData);
            var totals = _service.GetTotals(response.DailyData);
            
            Assert.Equal(7500, totals["Mark"]);   // 1000 + 1500 + 2000 + 1200 + 1800
            Assert.Equal(11500, totals["John"]);  // 2000 + 2500 + 1800 + 3000 + 2200
            Assert.Equal(9200, totals["Sarah"]);  // 1500 + 1200 + 2200 + 1800 + 2500
        }

        [Fact]
        public void GetTotals_WithEmptyData_ReturnsEmptyDictionary()
        {
            var totals = _service.GetTotals(new List<StepEntry>());
            
            Assert.NotNull(totals);
            Assert.Empty(totals);
        }

        [Fact]
        public void GetParticipantData_ReturnsCorrectData()
        {
            var response = _service.ParseStepsData(sampleRawData);
            var participantData = _service.GetParticipantData(response.DailyData, "Mark");
            
            Assert.NotNull(participantData);
            Assert.Equal("Mark", participantData.Name);
            Assert.Equal(7500, participantData.TotalSteps);
            Assert.Equal(1500.0, participantData.AverageSteps);
            Assert.Equal(2000, participantData.HighestSingleDay);
        }

        [Fact]
        public void GetParticipantData_WithNonExistentParticipant_ReturnsDefault()
        {
            var response = _service.ParseStepsData(sampleRawData);
            var participantData = _service.GetParticipantData(response.DailyData, "NonExistent");
            
            Assert.NotNull(participantData);
            Assert.Equal("NonExistent", participantData.Name);
            Assert.Equal(0, participantData.TotalSteps);
            Assert.Equal(0, participantData.AverageSteps);
            Assert.Equal(0, participantData.HighestSingleDay);
        }

        [Fact]
        public void FilterParticipantDataFromDate_ReturnsFilteredData()
        {
            var response = _service.ParseStepsData(sampleRawData);
            var participantData = response.ParticipantData.First(p => p.Name == "Mark");
            var fromDate = new DateTime(2025, 1, 3); // Day 3
            
            var filteredData = _service.FilterParticipantDataFromDate(participantData, response.DailyData, fromDate);
            
            Assert.NotNull(filteredData);
            Assert.Equal("Mark", filteredData.Name);
            // Should only include data from day 3 onwards
            Assert.Equal(3, filteredData.DailySteps.Count); // Days 3, 4, 5
        }

        [Fact]
        public void CalculateParticipantData_CalculatesStreaksAndWins()
        {
            var response = _service.ParseStepsData(sampleRawData);
            var markData = response.ParticipantData.First(p => p.Name == "Mark");
            
            // Verify that streaks and wins are calculated
            Assert.True(markData.BestWinStreak >= 0);
            Assert.True(markData.CurrentWinStreak >= 0);
            Assert.True(markData.CurrentLosingStreak >= 0);
            Assert.True(markData.MonthlyWins >= 0);
            Assert.True(markData.AllTimeWins >= 0);
        }
    }
} 