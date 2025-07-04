using Microsoft.AspNetCore.Mvc;
using StepTracker.Interfaces;

namespace StepTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SheetsController : ControllerBase
    {
        private readonly IGoogleSheetsService _sheetsService;

        public SheetsController(IGoogleSheetsService sheetsService)
        {
            _sheetsService = sheetsService;
        }

        [HttpGet("tabs")]
        public async Task<ActionResult<List<string>>> GetSheetTabs()
        {
            try
            {
                var tabNames = await _sheetsService.GetSheetNamesAsync();
                return Ok(tabNames);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
