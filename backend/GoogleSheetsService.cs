using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace StepTracker.Backend
{
    public class GoogleSheetsService
    {
        private readonly string[] Scopes = { SheetsService.Scope.SpreadsheetsReadonly };
        private readonly string ApplicationName = "StepBrothers Step Tracker";
        private readonly string? SpreadsheetId;
        private readonly string? SheetRange;
        private readonly SheetsService Service;

        public GoogleSheetsService(IConfiguration configuration)
        {
            var apiKey = configuration["GoogleSheets:ApiKey"] ?? throw new ArgumentNullException(nameof(configuration), "GoogleSheets:ApiKey is required");
            SpreadsheetId = configuration["GoogleSheets:SpreadsheetId"] ?? throw new ArgumentNullException(nameof(configuration), "GoogleSheets:SpreadsheetId is required");
            SheetRange = configuration["GoogleSheets:SheetRange"] ?? throw new ArgumentNullException(nameof(configuration), "GoogleSheets:SheetRange is required");
            
            Service = new SheetsService(new BaseClientService.Initializer()
            {
                ApiKey = apiKey,
                ApplicationName = ApplicationName,
            });
        }

        public async Task<IList<IList<object>>> GetSheetDataAsync()
        {
            if (string.IsNullOrEmpty(SpreadsheetId) || string.IsNullOrEmpty(SheetRange))
                throw new InvalidOperationException("SpreadsheetId and SheetRange must be configured");
                
            var request = Service.Spreadsheets.Values.Get(SpreadsheetId, SheetRange);
            ValueRange response = await request.ExecuteAsync();
            return response.Values ?? new List<IList<object>>();
        }

        public async Task<List<string>> GetSheetNamesAsync()
        {
            if (string.IsNullOrEmpty(SpreadsheetId))
                throw new InvalidOperationException("SpreadsheetId must be configured");
                
            var request = Service.Spreadsheets.Get(SpreadsheetId);
            Spreadsheet response = await request.ExecuteAsync();
            var sheetNames = new List<string>();
            foreach (var sheet in response.Sheets ?? new List<Sheet>())
            {
                if (sheet.Properties != null && !string.IsNullOrWhiteSpace(sheet.Properties.Title))
                {
                    sheetNames.Add(sheet.Properties.Title);
                }
            }
            return sheetNames;
        }
    }
}
