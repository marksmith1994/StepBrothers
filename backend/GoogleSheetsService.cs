using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
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
        private readonly string SpreadsheetId;
        private readonly string SheetRange;
        private readonly SheetsService Service;

        public GoogleSheetsService(string credentialsPath, string spreadsheetId, string sheetRange)
        {
            SpreadsheetId = spreadsheetId;
            SheetRange = sheetRange;
            GoogleCredential credential;
            using (var stream = new FileStream(credentialsPath, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream).CreateScoped(Scopes);
            }
            Service = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });
        }

        public async Task<IList<IList<object>>> GetSheetDataAsync()
        {
            var request = Service.Spreadsheets.Values.Get(SpreadsheetId, SheetRange);
            ValueRange response = await request.ExecuteAsync();
            return response.Values;
        }

        // New: Get all sheet/tab names in the spreadsheet
        public async Task<List<string>> GetSheetNamesAsync()
        {
            var request = Service.Spreadsheets.Get(SpreadsheetId);
            Spreadsheet response = await request.ExecuteAsync();
            var sheetNames = new List<string>();
            foreach (var sheet in response.Sheets)
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
