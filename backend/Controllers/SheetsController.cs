using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using StepTracker.Backend;

namespace StepTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SheetsController : ControllerBase
    {
        private static readonly Dictionary<string, (DateTime date, List<Dictionary<string, object>> data)> _cache = new();

        [HttpGet("data")]
        public async Task<ActionResult<List<Dictionary<string, object>>>> GetSheetData([FromQuery] string tab = "dashboard")
        {
            string spreadsheetId = "1BWYUTco2qh4U8GnBvpRFz7WImFbHWq1afomGC86NQNE";
            string credentialsPath = "credentials.json";
            string range = tab.ToLower() == "dashboard"
                ? "dashboard!A1:G22"
                : $"{tab}!A1:H39";

            // CACHE: If we have data for this tab today, return it
            var today = DateTime.UtcNow.Date;
            if (_cache.TryGetValue(tab.ToLower(), out var cached) && cached.date == today)
            {
                return Ok(cached.data);
            }

            var sheetsService = new GoogleSheetsService(credentialsPath, spreadsheetId, range);
            var data = await sheetsService.GetSheetDataAsync();

            // Robust parsing for multi-row header and valid month rows
            var result = new List<Dictionary<string, object>>();
            if (data == null || data.Count < 3)
                return Ok(result);
            // Find the actual header row (the one with 'Mark', 'Calum', etc.)
            int headerRowIdx = -1;
            for (int i = 0; i < Math.Min(5, data.Count); i++)
            {
                if (data[i].Contains("Mark") && data[i].Contains("Total"))
                {
                    headerRowIdx = i;
                    break;
                }
            }
            if (headerRowIdx == -1 || headerRowIdx + 1 >= data.Count)
                return Ok(result);
            var headers = data[headerRowIdx];
            // Data starts after the header row
            for (int i = headerRowIdx + 1; i < data.Count; i++)
            {
                var row = data[i];
                // Skip empty or summary rows
                if (row.Count == 0 || row[0] == null) continue;
                string monthRaw = row[0]?.ToString()?.Trim().ToLower() ?? "";
                if (string.IsNullOrWhiteSpace(monthRaw)) continue;
                if (monthRaw == "annual" || monthRaw == "daily average" || monthRaw == "") break;
                if (monthRaw.Length < 3) continue; // skip short/empty
                // Only process rows with enough columns
                if (row.Count < headers.Count) continue;
                var entry = new Dictionary<string, object>();
                for (int j = 0; j < headers.Count; j++)
                {
                    var key = headers[j]?.ToString()?.Trim().ToLower() ?? "col"+j;
                    if (string.IsNullOrWhiteSpace(key)) continue;
                    entry[key] = row[j];
                }
                entry["month"] = row[0]; // always include original month label
                result.Add(entry);
            }
            // CACHE: Save today's data
            _cache[tab.ToLower()] = (today, result);
            return Ok(result);
        }

        [HttpGet("tabs")]
        public async Task<ActionResult<List<string>>> GetSheetTabs()
        {
            string spreadsheetId = "1BWYUTco2qh4U8GnBvpRFz7WImFbHWq1afomGC86NQNE";
            string credentialsPath = "credentials.json";
            var sheetsService = new GoogleSheetsService(credentialsPath, spreadsheetId, null);
            var tabNames = await sheetsService.GetSheetNamesAsync();
            return Ok(tabNames);
        }
    }
}
