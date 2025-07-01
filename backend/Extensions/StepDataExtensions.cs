using StepTracker.Models;

namespace StepTracker.Extensions
{
    public static class StepDataExtensions
    {
        public static StepEntry ToStepEntry(this IList<object> rowData, int dayIndex, List<string> participants)
        {
            var stepEntry = new StepEntry
            {
                Day = dayIndex
            };

            int dayTotal = 0;
            for (int personIndex = 0; personIndex < Math.Min(participants.Count, rowData.Count); personIndex++)
            {
                var stepValue = rowData[personIndex]?.ToString() ?? "0";
                stepValue = stepValue.Replace(",", "");
                
                if (int.TryParse(stepValue, out int steps))
                {
                    stepEntry.Steps[participants[personIndex]] = steps;
                    dayTotal += steps;
                }
                else
                {
                    stepEntry.Steps[participants[personIndex]] = 0;
                }
            }
            
            stepEntry.Total = dayTotal;
            return stepEntry;
        }

        public static List<string> ExtractParticipants(this IList<IList<object>> rawData)
        {
            if (rawData == null || rawData.Count == 0)
                return new List<string>();

            return rawData[0].Select(p => p.ToString() ?? "").ToList();
        }

        public static List<StepEntry> ToStepEntries(this IList<IList<object>> rawData, List<string> participants)
        {
            var stepEntries = new List<StepEntry>();
            
            if (rawData == null || rawData.Count < 2)
                return stepEntries;

            for (int dayIndex = 1; dayIndex < rawData.Count; dayIndex++)
            {
                var dayData = rawData[dayIndex];
                if (dayData == null || dayData.Count == 0) continue;

                var stepEntry = dayData.ToStepEntry(dayIndex, participants);
                stepEntries.Add(stepEntry);
            }

            return stepEntries;
        }

        public static ParticipantData ToParticipantData(this string participantName, List<StepEntry> dailyData)
        {
            var data = new ParticipantData
            {
                Name = participantName
            };

            foreach (var dayEntry in dailyData)
            {
                if (dayEntry.Steps.TryGetValue(participantName, out int steps))
                {
                    data.DailySteps.Add(steps);
                    data.TotalSteps += steps;
                    data.HighestSingleDay = Math.Max(data.HighestSingleDay, steps);
                }
                else
                {
                    data.DailySteps.Add(0);
                }
            }

            data.AverageSteps = data.DailySteps.Count > 0 ? (double)data.TotalSteps / data.DailySteps.Count : 0;
            
            return data;
        }

        public static Dictionary<string, int> ToTotalsDictionary(this List<StepEntry> dailyData, List<string> participants)
        {
            var totals = new Dictionary<string, int>();
            
            foreach (var participant in participants)
            {
                totals[participant] = dailyData.Sum(entry => 
                    entry.Steps.TryGetValue(participant, out int steps) ? steps : 0);
            }
            
            return totals;
        }
    }
} 