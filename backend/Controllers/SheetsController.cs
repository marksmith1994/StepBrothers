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
        public async Task<IActionResult> GetParticipantData(string name)
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
                
                // Debug: Log available participants
                Console.WriteLine($"Looking for participant: '{name}'");
                Console.WriteLine($"Available participants: {string.Join(", ", stepData.Participants)}");
                
                var participantData = stepData.ParticipantData.FirstOrDefault(p => 
                    p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                
                if (participantData == null)
                {
                    return NotFound($"Participant '{name}' not found. Available participants: {string.Join(", ", stepData.Participants)}");
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
    }
}
