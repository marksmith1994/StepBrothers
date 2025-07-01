using System.Text.Json.Serialization;

namespace StepTracker.Models
{
    public class StepDataResponse
    {
        [JsonPropertyName("participants")]
        public List<string> Participants { get; set; } = new();
        
        [JsonPropertyName("dailyData")]
        public List<StepEntry> DailyData { get; set; } = new();
        
        [JsonPropertyName("participantData")]
        public List<ParticipantData> ParticipantData { get; set; } = new();
    }
} 