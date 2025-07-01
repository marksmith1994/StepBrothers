using StepTracker.Models;

namespace StepTracker.Interfaces
{
    public interface IGamificationService
    {
        GamificationData CalculateGamificationData(List<StepEntry> dailyData, List<string> participants);
        List<MonthlyWinner> CalculateMonthlyWinners(List<StepEntry> dailyData, List<string> participants);
        List<AllTimeBest> CalculateAllTimeBests(List<StepEntry> dailyData, List<string> participants);
        List<CumulativeData> CalculateCumulativeData(List<StepEntry> dailyData, List<string> participants);
        Dictionary<string, int> CalculateCurrentStreaks(List<StepEntry> dailyData, List<string> participants);
    }
} 