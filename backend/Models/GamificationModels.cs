using System.Text.Json.Serialization;

namespace StepTracker.Models
{
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