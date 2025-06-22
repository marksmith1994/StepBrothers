using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace StepTracker.Models
{
    public class StepEntry
    {
        public int Day { get; set; }
        public Dictionary<string, int> Steps { get; set; } = new();
        public int Total { get; set; }
    }

    public class ParticipantData
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        
        [JsonPropertyName("dailySteps")]
        public List<int> DailySteps { get; set; } = new();
        
        [JsonPropertyName("totalSteps")]
        public int TotalSteps { get; set; }
        
        [JsonPropertyName("averageSteps")]
        public double AverageSteps { get; set; }
        
        [JsonPropertyName("bestWinStreak")]
        public int BestWinStreak { get; set; }
        
        [JsonPropertyName("currentWinStreak")]
        public int CurrentWinStreak { get; set; }
        
        [JsonPropertyName("currentLosingStreak")]
        public int CurrentLosingStreak { get; set; }
        
        [JsonPropertyName("highestSingleDay")]
        public int HighestSingleDay { get; set; }
        
        [JsonPropertyName("monthlyWins")]
        public int MonthlyWins { get; set; }
        
        [JsonPropertyName("allTimeWins")]
        public int AllTimeWins { get; set; }
    }

    public class StepDataResponse
    {
        [JsonPropertyName("participants")]
        public List<string> Participants { get; set; } = new();
        
        [JsonPropertyName("dailyData")]
        public List<StepEntry> DailyData { get; set; } = new();
        
        [JsonPropertyName("participantData")]
        public List<ParticipantData> ParticipantData { get; set; } = new();
    }

    public class MonthlyWinner
    {
        [JsonPropertyName("month")]
        public string Month { get; set; } = string.Empty;
        
        [JsonPropertyName("winner")]
        public string Winner { get; set; } = string.Empty;
        
        [JsonPropertyName("steps")]
        public int Steps { get; set; }
        
        [JsonPropertyName("daysInMonth")]
        public int DaysInMonth { get; set; }
    }

    public class AllTimeBest
    {
        [JsonPropertyName("participant")]
        public string Participant { get; set; } = string.Empty;
        
        [JsonPropertyName("steps")]
        public int Steps { get; set; }
        
        [JsonPropertyName("day")]
        public int Day { get; set; }
        
        [JsonPropertyName("date")]
        public string Date { get; set; } = string.Empty;
    }

    public class CumulativeData
    {
        [JsonPropertyName("day")]
        public int Day { get; set; }
        
        [JsonPropertyName("cumulativeSteps")]
        public Dictionary<string, int> CumulativeSteps { get; set; } = new();
    }

    public class GamificationData
    {
        [JsonPropertyName("monthlyWinners")]
        public List<MonthlyWinner> MonthlyWinners { get; set; } = new();
        
        [JsonPropertyName("allTimeBests")]
        public List<AllTimeBest> AllTimeBests { get; set; } = new();
        
        [JsonPropertyName("cumulativeData")]
        public List<CumulativeData> CumulativeData { get; set; } = new();
        
        [JsonPropertyName("currentStreaks")]
        public Dictionary<string, int> CurrentStreaks { get; set; } = new();
    }
}
