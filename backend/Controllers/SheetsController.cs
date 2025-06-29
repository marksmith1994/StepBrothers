using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Collections.Generic;
using StepTracker.Backend;
using StepTracker.Services;
using StepTracker.Models;

namespace StepTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SheetsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly StepService _stepService;
        private static readonly Dictionary<string, (DateTime date, StepDataResponse data)> _cache = new();

        public SheetsController(IConfiguration configuration)
        {
            _configuration = configuration;
            _stepService = new StepService();
        }

        [HttpGet("data")]
        public async Task<IActionResult> GetSheetData([FromQuery] string tab = "dashboard", [FromQuery] int? year = null)
        {
            try
            {
                var sheetsService = new GoogleSheetsService(_configuration);
                var rawData = await sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepService.ParseStepsData(rawData, tab, year);
                
                return Ok(stepData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("gamification")]
        public async Task<IActionResult> GetGamificationData()
        {
            try
            {
                var sheetsService = new GoogleSheetsService(_configuration);
                var rawData = await sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepService.ParseStepsData(rawData, null, null);
                var gamificationData = _stepService.CalculateGamificationData(stepData.DailyData, stepData.Participants);
                return Ok(gamificationData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("tabs")]
        public async Task<ActionResult<List<string>>> GetSheetTabs()
        {
            try
            {
                var sheetsService = new GoogleSheetsService(_configuration);
            var tabNames = await sheetsService.GetSheetNamesAsync();
            return Ok(tabNames);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("participant/{name}")]
        public async Task<IActionResult> GetParticipantData(string name, [FromQuery] DateTime? fromDate = null)
        {
            try
            {
                var sheetsService = new GoogleSheetsService(_configuration);
                var rawData = await sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepService.ParseStepsData(rawData, null, null);
                
                var participantData = stepData.ParticipantData.FirstOrDefault(p => 
                    p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                
                if (participantData == null)
                {
                    return NotFound($"Participant '{name}' not found. Available participants: {string.Join(", ", stepData.Participants)}");
                }

                // Filter data from the specified date if provided
                if (fromDate.HasValue)
                {
                    // Extract just the date part (remove time)
                    var dateOnly = fromDate.Value.Date;
                    participantData = _stepService.FilterParticipantDataFromDate(participantData, stepData.DailyData, dateOnly);
                }

                return Ok(participantData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("totals")]
        public async Task<IActionResult> GetTotals()
        {
            try
            {
                var sheetsService = new GoogleSheetsService(_configuration);
                var rawData = await sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepService.ParseStepsData(rawData, null, null);
                var totals = _stepService.GetTotals(stepData.DailyData);
                return Ok(totals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("test-filter/{name}")]
        public async Task<IActionResult> TestFilter(string name, [FromQuery] DateTime fromDate)
        {
            try
            {
                var sheetsService = new GoogleSheetsService(_configuration);
                var rawData = await sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepService.ParseStepsData(rawData, null, null);
                
                var participantData = stepData.ParticipantData.FirstOrDefault(p => 
                    p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                
                if (participantData == null)
                {
                    return NotFound($"Participant '{name}' not found");
                }

                // Test filtering
                var originalTotal = participantData.TotalSteps;
                var originalWins = participantData.AllTimeWins;
                
                var filteredData = _stepService.FilterParticipantDataFromDate(participantData, stepData.DailyData, fromDate.Date);
                
                var result = new
                {
                    Participant = name,
                    FromDate = fromDate.Date.ToString("yyyy-MM-dd"),
                    OriginalTotalSteps = originalTotal,
                    OriginalWins = originalWins,
                    FilteredTotalSteps = filteredData.TotalSteps,
                    FilteredWins = filteredData.AllTimeWins,
                    FilteredAverage = filteredData.AverageSteps,
                    DayOffset = (fromDate.Date - new DateTime(2025, 1, 1)).Days,
                    TotalDataDays = stepData.DailyData.Count,
                    FilteredDataDays = stepData.DailyData.Count - (fromDate.Date - new DateTime(2025, 1, 1)).Days
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
