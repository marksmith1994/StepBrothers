using System.Collections.Generic;
using Xunit;
using StepTracker.Services;

namespace StepTracker.Tests
{
    public class StepServiceTests
    {
        private readonly StepService _service = new StepService();

        private readonly string sampleCsv = @"Month,Mark,John,Total
January,1000,2000,3000
February,1500,2500,4000
Daily Average,1250,2250,3500";

        [Fact]
        public void ParseSteps_ReturnsCorrectEntries()
        {
            var entries = _service.ParseSteps(sampleCsv);
            Assert.Equal(2, entries.Count); // Should stop at Daily Average
            Assert.Equal("January", entries[0].Month);
            Assert.Equal(1000, entries[0].Steps["Mark"]);
            Assert.Equal(2000, entries[0].Steps["John"]);
            Assert.Equal(3000, entries[0].Total);
        }

        [Fact]
        public void GetTotals_ReturnsCorrectTotals()
        {
            var entries = _service.ParseSteps(sampleCsv);
            var totals = _service.GetTotals(entries);
            Assert.Equal(2500, totals["Mark"]);
            Assert.Equal(4500, totals["John"]);
        }

        [Fact]
        public void ParseSteps_HandlesEmptyCsv()
        {
            var entries = _service.ParseSteps("");
            Assert.Empty(entries);
        }
    }
}
