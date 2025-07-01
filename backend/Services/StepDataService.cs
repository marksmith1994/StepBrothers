using StepTracker.Interfaces;
using StepTracker.Models;
using StepTracker.Extensions;

namespace StepTracker.Services
{
    public class StepDataService : IStepDataService
    {
        public StepDataResponse ParseStepsData(IList<IList<object>> rawData, string? month = null, int? year = null)
        {
            var response = new StepDataResponse();
            
            if (rawData == null || rawData.Count < 2)
                return response;

            // Extract participants from first row
            response.Participants = rawData.ExtractParticipants();
            
            // Convert raw data to step entries
            response.DailyData = rawData.ToStepEntries(response.Participants);

            // Filter by month and year if specified
            if (!string.IsNullOrEmpty(month) || year.HasValue)
            {
                response = FilterByMonthAndYear(response, month, year);
            }

            // Calculate participant summaries
            response.ParticipantData = CalculateParticipantData(response.DailyData, response.Participants);

            return response;
        }

        public StepDataResponse FilterByMonthAndYear(StepDataResponse data, string? month, int? year)
        {
            if (string.IsNullOrEmpty(month) && !year.HasValue)
                return data;

            // If month is "dashboard", return all data (no filtering)
            if (month?.ToLower() == "dashboard")
                return data;

            var filteredData = new StepDataResponse
            {
                Participants = data.Participants
            };

            var monthIndex = GetMonthIndex(month);
            var daysPerMonth = 30;
            var startDay = monthIndex * daysPerMonth;
            var endDay = startDay + daysPerMonth;

            // Filter daily data based on estimated month boundaries
            filteredData.DailyData = data.DailyData
                .Where(entry => entry.Day > startDay && entry.Day <= endDay)
                .ToList();

            return filteredData;
        }

        public List<ParticipantData> CalculateParticipantData(List<StepEntry> dailyData, List<string> participants)
        {
            var participantData = new List<ParticipantData>();

            foreach (var participant in participants)
            {
                var data = participant.ToParticipantData(dailyData);
                
                // Calculate streaks and wins
                CalculateStreaksAndWins(data, dailyData, participants);
                
                participantData.Add(data);
            }

            return participantData;
        }

        public Dictionary<string, int> GetTotals(List<StepEntry> entries)
        {
            if (entries == null || entries.Count == 0)
                return new Dictionary<string, int>();

            var allParticipants = entries
                .SelectMany(e => e.Steps.Keys)
                .Distinct()
                .ToList();

            return entries.ToTotalsDictionary(allParticipants);
        }

        public ParticipantData GetParticipantData(List<StepEntry> entries, string participantName)
        {
            if (entries == null || entries.Count == 0)
                return new ParticipantData { Name = participantName };

            var allParticipants = entries
                .SelectMany(e => e.Steps.Keys)
                .Distinct()
                .ToList();

            if (!allParticipants.Contains(participantName))
                return new ParticipantData { Name = participantName };

            return participantName.ToParticipantData(entries);
        }

        public ParticipantData FilterParticipantDataFromDate(ParticipantData participantData, List<StepEntry> dailyData, DateTime fromDate)
        {
            var filteredData = new ParticipantData
            {
                Name = participantData.Name
            };

            var startDay = (fromDate.Date - new DateTime(2025, 1, 1)).Days + 1;
            
            var filteredDailyData = dailyData
                .Where(entry => entry.Day >= startDay)
                .ToList();

            foreach (var dayEntry in filteredDailyData)
            {
                if (dayEntry.Steps.TryGetValue(participantData.Name, out int steps))
                {
                    filteredData.DailySteps.Add(steps);
                    filteredData.TotalSteps += steps;
                    filteredData.HighestSingleDay = Math.Max(filteredData.HighestSingleDay, steps);
                }
                else
                {
                    filteredData.DailySteps.Add(0);
                }
            }

            filteredData.AverageSteps = filteredData.DailySteps.Count > 0 
                ? (double)filteredData.TotalSteps / filteredData.DailySteps.Count 
                : 0;

            // Recalculate streaks and wins for filtered data
            CalculateStreaksAndWins(filteredData, filteredDailyData, dailyData
                .SelectMany(e => e.Steps.Keys)
                .Distinct()
                .ToList());

            return filteredData;
        }

        private void CalculateStreaksAndWins(ParticipantData participant, List<StepEntry> dailyData, List<string> allParticipants)
        {
            int currentWinStreak = 0;
            int currentLosingStreak = 0;
            int bestWinStreak = 0;
            int monthlyWins = 0;
            int allTimeWins = 0;

            for (int dayIndex = 0; dayIndex < dailyData.Count; dayIndex++)
            {
                var dayEntry = dailyData[dayIndex];
                if (!dayEntry.Steps.TryGetValue(participant.Name, out int participantSteps))
                    continue;

                // Check if this participant won the day
                bool wonDay = true;
                int maxSteps = participantSteps;
                
                foreach (var otherParticipant in allParticipants)
                {
                    if (otherParticipant == participant.Name) continue;
                    
                    if (dayEntry.Steps.TryGetValue(otherParticipant, out int otherSteps))
                    {
                        if (otherSteps > participantSteps)
                        {
                            wonDay = false;
                            break;
                        }
                        maxSteps = Math.Max(maxSteps, otherSteps);
                    }
                }

                // Handle ties - if tied for first, it's still a win
                if (wonDay && participantSteps == maxSteps)
                {
                    currentWinStreak++;
                    currentLosingStreak = 0;
                    bestWinStreak = Math.Max(bestWinStreak, currentWinStreak);
                    allTimeWins++;
                    
                    // Count monthly wins (simplified - you might want to add actual month detection)
                    if (dayIndex < 30) // Rough estimate for first month
                        monthlyWins++;
                }
                else
                {
                    currentLosingStreak++;
                    currentWinStreak = 0;
                }
            }

            participant.BestWinStreak = bestWinStreak;
            participant.CurrentWinStreak = currentWinStreak;
            participant.CurrentLosingStreak = currentLosingStreak;
            participant.MonthlyWins = monthlyWins;
            participant.AllTimeWins = allTimeWins;
        }

        private int GetMonthIndex(string? month)
        {
            if (string.IsNullOrEmpty(month))
                return 0;

            var months = new[] { 
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" 
            };

            return Array.IndexOf(months, month);
        }
    }
} 