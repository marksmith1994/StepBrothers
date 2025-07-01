using System.Text.Json.Serialization;

namespace StepTracker.Models
{
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
} 