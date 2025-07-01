using System.Collections.Generic;
using Xunit;
using StepTracker.Services;
using StepTracker.Models;

namespace StepTracker.Tests
{
    public class GamificationServiceTests
    {
        private readonly GamificationService _service = new GamificationService();

        private readonly List<StepEntry> sampleDailyData = new()
        {
            new StepEntry { Day = 1, Steps = new Dictionary<string, int> { { "Mark", 1000 }, { "John", 2000 }, { "Sarah", 1500 } }, Total = 4500 },
            new StepEntry { Day = 2, Steps = new Dictionary<string, int> { { "Mark", 1500 }, { "John", 2500 }, { "Sarah", 1200 } }, Total = 5200 },
            new StepEntry { Day = 3, Steps = new Dictionary<string, int> { { "Mark", 2000 }, { "John", 1800 }, { "Sarah", 2200 } }, Total = 6000 },
            new StepEntry { Day = 4, Steps = new Dictionary<string, int> { { "Mark", 1200 }, { "John", 3000 }, { "Sarah", 1800 } }, Total = 6000 },
            new StepEntry { Day = 5, Steps = new Dictionary<string, int> { { "Mark", 1800 }, { "John", 2200 }, { "Sarah", 2500 } }, Total = 6500 }
        };

        private readonly List<string> sampleParticipants = new() { "Mark", "John", "Sarah" };

        [Fact]
        public void CalculateGamificationData_ReturnsCompleteData()
        {
            var result = _service.CalculateGamificationData(sampleDailyData, sampleParticipants);
            
            Assert.NotNull(result);
            Assert.NotNull(result.MonthlyWinners);
            Assert.NotNull(result.AllTimeBests);
            Assert.NotNull(result.CumulativeData);
            Assert.NotNull(result.CurrentStreaks);
        }

        [Fact]
        public void CalculateGamificationData_WithEmptyData_ReturnsEmptyData()
        {
            var result = _service.CalculateGamificationData(new List<StepEntry>(), new List<string>());
            
            Assert.NotNull(result);
            Assert.Empty(result.MonthlyWinners);
            Assert.Empty(result.AllTimeBests);
            Assert.Empty(result.CumulativeData);
            Assert.Empty(result.CurrentStreaks);
        }

        [Fact]
        public void CalculateAllTimeBests_WithZeroSteps_HandlesCorrectly()
        {
            var dataWithZeros = new List<StepEntry>
            {
                new StepEntry { Day = 1, Steps = new Dictionary<string, int> { { "Mark", 0 }, { "John", 0 } }, Total = 0 },
                new StepEntry { Day = 2, Steps = new Dictionary<string, int> { { "Mark", 0 }, { "John", 0 } }, Total = 0 }
            };
            
            var result = _service.CalculateAllTimeBests(dataWithZeros, new List<string> { "Mark", "John" });
            
            Assert.NotNull(result);
            Assert.Empty(result); // No best days when all steps are 0
        }

        [Fact]
        public void CalculateCurrentStreaks_WithZeroSteps_ReturnsZeroStreaks()
        {
            var dataWithZeros = new List<StepEntry>
            {
                new StepEntry { Day = 1, Steps = new Dictionary<string, int> { { "Mark", 0 }, { "John", 0 } }, Total = 0 },
                new StepEntry { Day = 2, Steps = new Dictionary<string, int> { { "Mark", 0 }, { "John", 0 } }, Total = 0 }
            };
            
            var result = _service.CalculateCurrentStreaks(dataWithZeros, new List<string> { "Mark", "John" });
            
            Assert.NotNull(result);
            // Current implementation returns empty dictionary
            Assert.Empty(result);
        }
    }
} 