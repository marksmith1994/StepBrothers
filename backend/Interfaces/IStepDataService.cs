using StepTracker.Models;

namespace StepTracker.Interfaces
{
    public interface IStepDataService
    {
        StepDataResponse ParseStepsData(IList<IList<object>> rawData, string? month = null, int? year = null);
        StepDataResponse FilterByMonthAndYear(StepDataResponse data, string? month, int? year);
        List<ParticipantData> CalculateParticipantData(List<StepEntry> dailyData, List<string> participants);
        Dictionary<string, int> GetTotals(List<StepEntry> entries);
        ParticipantData GetParticipantData(List<StepEntry> entries, string participantName);
        ParticipantData FilterParticipantDataFromDate(ParticipantData participantData, List<StepEntry> dailyData, DateTime fromDate);
    }
} 