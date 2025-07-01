namespace StepTracker.Interfaces
{
    public interface IGoogleSheetsService
    {
        Task<IList<IList<object>>> GetSheetDataAsync();
        Task<List<string>> GetSheetNamesAsync();
    }
} 