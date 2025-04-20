using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace StepTracker.Models
{
    public class StepEntry
    {
        public string Month { get; set; }
        public Dictionary<string, int?> Steps { get; set; } = new();
        public int? Total { get; set; }
    }
}
