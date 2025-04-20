using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Net.Http;
using StepTracker.Models;
using StepTracker.Services;

[ApiController]
[Route("[controller]")]
public class StepsController : ControllerBase
{
    private readonly StepService _stepService = new StepService();

    [HttpGet]
    public async Task<IActionResult> GetSteps()
    {
        var csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbCOBKT6itkgrJuUGUhBkRcyfAMCXJV6D3CX8ChsLVQRwi1QbdwxYsnRCYVPmmi5dZCi1vZX27SOY/pub?output=csv";
        string csv;
        using (var httpClient = new HttpClient())
        {
            try
            {
                csv = await httpClient.GetStringAsync(csvUrl);
            }
            catch
            {
                return NotFound("Could not fetch CSV from Google Sheets.");
            }
        }
        var entries = _stepService.ParseSteps(csv);
        return Ok(entries);
    }

    [HttpGet("totals")]
    public async Task<IActionResult> GetTotals()
    {
        var csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbCOBKT6itkgrJuUGUhBkRcyfAMCXJV6D3CX8ChsLVQRwi1QbdwxYsnRCYVPmmi5dZCi1vZX27SOY/pub?output=csv";
        string csv;
        using (var httpClient = new HttpClient())
        {
            csv = await httpClient.GetStringAsync(csvUrl);
        }
        var entries = _stepService.ParseSteps(csv);
        var totals = _stepService.GetTotals(entries);
        return Ok(totals);
    }
}