using Microsoft.AspNetCore.Mvc;
using StepTracker.Interfaces;
using StepTracker.Models;

namespace StepTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StepsController : ControllerBase
    {
        private readonly IGoogleSheetsService _sheetsService;
        private readonly IStepDataService _stepDataService;
        private readonly IGamificationService _gamificationService;

        public StepsController(
            IGoogleSheetsService sheetsService,
            IStepDataService stepDataService,
            IGamificationService gamificationService)
        {
            _sheetsService = sheetsService;
            _stepDataService = stepDataService;
            _gamificationService = gamificationService;
        }

        /// <summary>
        /// Get all step data with optional filtering
        /// </summary>
        /// <param name="tab">Tab name to filter by</param>
        /// <param name="year">Year to filter by</param>
        /// <returns>Step data response</returns>
        [HttpGet]
        public async Task<ActionResult<StepDataResponse>> GetStepData(
            [FromQuery] string? tab = null, 
            [FromQuery] int? year = null)
        {
            try
            {
                var rawData = await _sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepDataService.ParseStepsData(rawData, tab, year);
                return Ok(stepData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get step data for a specific participant
        /// </summary>
        /// <param name="participantName">Name of the participant</param>
        /// <param name="fromDate">Optional start date for filtering</param>
        /// <returns>Participant data</returns>
        [HttpGet("participants/{participantName}")]
        public async Task<ActionResult<ParticipantData>> GetParticipantData(
            string participantName, 
            [FromQuery] DateTime? fromDate = null)
        {
            try
            {
                var rawData = await _sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepDataService.ParseStepsData(rawData, null, null);
                
                var participantData = stepData.ParticipantData.FirstOrDefault(p => 
                    p.Name.Equals(participantName, StringComparison.OrdinalIgnoreCase));
                
                if (participantData == null)
                {
                    return NotFound($"Participant '{participantName}' not found. Available participants: {string.Join(", ", stepData.Participants)}");
                }

                if (fromDate.HasValue)
                {
                    participantData = _stepDataService.FilterParticipantDataFromDate(
                        participantData, stepData.DailyData, fromDate.Value.Date);
                }

                return Ok(participantData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get total steps for all participants
        /// </summary>
        /// <returns>Dictionary of participant totals</returns>
        [HttpGet("totals")]
        public async Task<ActionResult<Dictionary<string, int>>> GetTotals()
        {
            try
            {
                var rawData = await _sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepDataService.ParseStepsData(rawData, null, null);
                var totals = _stepDataService.GetTotals(stepData.DailyData);
                return Ok(totals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get gamification data including winners, streaks, and achievements
        /// </summary>
        /// <returns>Gamification data</returns>
        [HttpGet("gamification")]
        public async Task<ActionResult<GamificationData>> GetGamificationData()
        {
            try
            {
                var rawData = await _sheetsService.GetSheetDataAsync();
                
                if (rawData == null || rawData.Count == 0)
                {
                    return NotFound("No data found in the sheet");
                }

                var stepData = _stepDataService.ParseStepsData(rawData, null, null);
                var gamificationData = _gamificationService.CalculateGamificationData(stepData.DailyData, stepData.Participants);
                return Ok(gamificationData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
} 