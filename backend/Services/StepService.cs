using System;
using System.Collections.Generic;
using System.Linq;

namespace StepTracker.Services
{
    public class StepEntry
    {
        public string Month { get; set; }
        public Dictionary<string, int> Steps { get; set; } = new();
        public int Total { get; set; }
    }

    public class StepService
    {
        // Parses CSV string into a list of StepEntry objects
        public List<StepEntry> ParseSteps(string csv)
        {
            var lines = csv.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.RemoveEmptyEntries);
            if (lines.Length < 3) return new List<StepEntry>();
            var headers = lines[1].Split(',').Select(h => h.Trim()).ToList();
            var people = headers.Skip(1).Take(headers.Count - 2).ToList();
            var entries = new List<StepEntry>();
            for (int i = 2; i < lines.Length; i++)
            {
                var row = System.Text.RegularExpressions.Regex.Split(lines[i], @",(?=(?:[^""]*""[^""]*"")*[^""]*$)");
                if ((row[0] ?? "").Trim().ToLower() == "daily average") break;
                var entry = new StepEntry { Month = row[0] };
                int total = 0;
                for (int j = 1; j < row.Length - 1 && j - 1 < people.Count; j++)
                {
                    var val = row[j].Replace("\"", "").Replace(",", "").Trim();
                    if (int.TryParse(val, out var steps))
                    {
                        entry.Steps[people[j - 1]] = steps;
                        total += steps;
                    }
                }
                entry.Total = total;
                entries.Add(entry);
            }
            return entries;
        }

        // Aggregates total steps for each person
        public Dictionary<string, int> GetTotals(List<StepEntry> entries)
        {
            if (entries == null || entries.Count == 0) return new();
            var people = entries[0].Steps.Keys;
            var totals = people.ToDictionary(p => p, p => 0);
            foreach (var entry in entries)
            {
                foreach (var person in people)
                {
                    if (entry.Steps.TryGetValue(person, out var steps))
                        totals[person] += steps;
                }
            }
            return totals;
        }
    }
}
