using System;
using System.Collections.Generic;
using System.Linq;
using StepTracker.Models;

namespace StepTracker.Services
{
    public class StepService
    {
        // Parses Google Sheets data into structured step data
        public StepDataResponse ParseStepsData(IList<IList<object>> rawData, string? month = null, int? year = null)
        {
            var response = new StepDataResponse();
            
            if (rawData == null || rawData.Count < 2)
                return response;

            // First row contains participant names
            var participants = rawData[0].Select(p => p.ToString() ?? "").ToList();
            response.Participants = participants;

            // Process daily data (starting from row 2)
            for (int dayIndex = 1; dayIndex < rawData.Count; dayIndex++)
            {
                var dayData = rawData[dayIndex];
                if (dayData == null || dayData.Count == 0) continue;

                var stepEntry = new StepEntry
                {
                    Day = dayIndex
                };

                int dayTotal = 0;
                for (int personIndex = 0; personIndex < Math.Min(participants.Count, dayData.Count); personIndex++)
                {
                    var stepValue = dayData[personIndex]?.ToString() ?? "0";
                    // Remove commas and parse as integer
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
                response.DailyData.Add(stepEntry);
            }

            // Filter by month and year if specified
            if (!string.IsNullOrEmpty(month) || year.HasValue)
            {
                response = FilterByMonthAndYear(response, month, year);
            }

            // Calculate participant summaries with gamification data
            response.ParticipantData = CalculateParticipantData(response.DailyData, participants);

            return response;
        }

        // Filter data by month and year
        private StepDataResponse FilterByMonthAndYear(StepDataResponse data, string? month, int? year)
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

            // For now, we'll implement a simple filtering based on the assumption
            // that each month has approximately 30 days of data
            // This is a simplified approach - in a real implementation, you'd want
            // to parse actual dates from the Google Sheets data
            
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

        private List<ParticipantData> CalculateParticipantData(List<StepEntry> dailyData, List<string> participants)
        {
            var participantData = new List<ParticipantData>();

            foreach (var participant in participants)
            {
                var data = new ParticipantData
                {
                    Name = participant
                };

                foreach (var dayEntry in dailyData)
                {
                    if (dayEntry.Steps.TryGetValue(participant, out int steps))
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
                
                // Calculate streaks and wins
                CalculateStreaksAndWins(data, dailyData, participants);
                
                participantData.Add(data);
            }

            return participantData;
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

            participant.CurrentWinStreak = currentWinStreak;
            participant.CurrentLosingStreak = currentLosingStreak;
            participant.BestWinStreak = bestWinStreak;
            participant.MonthlyWins = monthlyWins;
            participant.AllTimeWins = allTimeWins;
        }

        public GamificationData CalculateGamificationData(List<StepEntry> dailyData, List<string> participants)
        {
            var gamificationData = new GamificationData();

            // Calculate monthly winners
            gamificationData.MonthlyWinners = CalculateMonthlyWinners(dailyData, participants);

            // Calculate all-time bests
            gamificationData.AllTimeBests = CalculateAllTimeBests(dailyData, participants);

            // Calculate cumulative data
            gamificationData.CumulativeData = CalculateCumulativeData(dailyData, participants);

            // Calculate current streaks
            gamificationData.CurrentStreaks = CalculateCurrentStreaks(dailyData, participants);

            return gamificationData;
        }

        private List<MonthlyWinner> CalculateMonthlyWinners(List<StepEntry> dailyData, List<string> participants)
        {
            var monthlyWinners = new List<MonthlyWinner>();
            
            // Group by month (simplified - assuming 30 days per month)
            int daysPerMonth = 30;
            int monthCount = (dailyData.Count + daysPerMonth - 1) / daysPerMonth;

            for (int month = 0; month < monthCount; month++)
            {
                var monthData = dailyData.Skip(month * daysPerMonth).Take(daysPerMonth).ToList();
                if (!monthData.Any()) continue;

                var monthlyTotals = new Dictionary<string, int>();
                foreach (var participant in participants)
                {
                    monthlyTotals[participant] = monthData.Sum(day => 
                        day.Steps.TryGetValue(participant, out int steps) ? steps : 0);
                }

                var winner = monthlyTotals.OrderByDescending(x => x.Value).First();
                monthlyWinners.Add(new MonthlyWinner
                {
                    Month = GetMonthName(month),
                    Winner = winner.Key,
                    Steps = winner.Value,
                    DaysInMonth = monthData.Count
                });
            }

            return monthlyWinners;
        }

        private List<AllTimeBest> CalculateAllTimeBests(List<StepEntry> dailyData, List<string> participants)
        {
            var allTimeBests = new List<AllTimeBest>();

            foreach (var participant in participants)
            {
                var bestDay = dailyData
                    .Where(day => day.Steps.TryGetValue(participant, out int steps) && steps > 0)
                    .OrderByDescending(day => day.Steps[participant])
                    .FirstOrDefault();

                if (bestDay != null)
                {
                    allTimeBests.Add(new AllTimeBest
                    {
                        Participant = participant,
                        Steps = bestDay.Steps[participant],
                        Day = bestDay.Day,
                        Date = $"Day {bestDay.Day}"
                    });
                }
            }

            return allTimeBests.OrderByDescending(x => x.Steps).ToList();
        }

        private List<CumulativeData> CalculateCumulativeData(List<StepEntry> dailyData, List<string> participants)
        {
            var cumulativeData = new List<CumulativeData>();
            var runningTotals = new Dictionary<string, int>();

            foreach (var participant in participants)
            {
                runningTotals[participant] = 0;
            }

            for (int dayIndex = 0; dayIndex < dailyData.Count; dayIndex++)
            {
                var dayEntry = dailyData[dayIndex];
                var cumulativeEntry = new CumulativeData
                {
                    Day = dayIndex + 1,
                    CumulativeSteps = new Dictionary<string, int>()
                };

                foreach (var participant in participants)
                {
                    if (dayEntry.Steps.TryGetValue(participant, out int steps))
                    {
                        runningTotals[participant] += steps;
                    }
                    cumulativeEntry.CumulativeSteps[participant] = runningTotals[participant];
                }

                cumulativeData.Add(cumulativeEntry);
            }

            return cumulativeData;
        }

        private Dictionary<string, int> CalculateCurrentStreaks(List<StepEntry> dailyData, List<string> participants)
        {
            var currentStreaks = new Dictionary<string, int>();

            foreach (var participant in participants)
            {
                int currentStreak = 0;
                bool isWinStreak = false;

                // Go backwards from the most recent day
                for (int i = dailyData.Count - 1; i >= 0; i--)
                {
                    var dayEntry = dailyData[i];
                    if (!dayEntry.Steps.TryGetValue(participant, out int participantSteps))
                        continue;

                    // Check if this participant won the day
                    bool wonDay = true;
                    int maxSteps = participantSteps;
                    
                    foreach (var otherParticipant in participants)
                    {
                        if (otherParticipant == participant) continue;
                        
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

                    // Handle ties
                    if (wonDay && participantSteps == maxSteps)
                    {
                        if (!isWinStreak && currentStreak == 0)
                        {
                            isWinStreak = true;
                        }
                        
                        if (isWinStreak)
                        {
                            currentStreak++;
                        }
                        else
                        {
                            break; // Streak broken
                        }
                    }
                    else
                    {
                        if (isWinStreak)
                        {
                            break; // Win streak broken
                        }
                        else
                        {
                            currentStreak++;
                        }
                    }
                }

                currentStreaks[participant] = currentStreak;
            }

            return currentStreaks;
        }

        private string GetMonthName(int monthIndex)
        {
            var months = new[] { "January", "February", "March", "April", "May", "June", 
                                "July", "August", "September", "October", "November", "December" };
            return months[monthIndex % 12];
        }

        // Get totals for each participant
        public Dictionary<string, int> GetTotals(List<StepEntry> entries)
        {
            if (entries == null || entries.Count == 0) return new();
            
            var totals = new Dictionary<string, int>();
            var firstEntry = entries.FirstOrDefault();
            if (firstEntry == null) return totals;
            
            var participants = firstEntry.Steps.Keys;

            foreach (var participant in participants)
            {
                totals[participant] = entries.Sum(entry => 
                    entry.Steps.TryGetValue(participant, out int steps) ? steps : 0);
            }

            return totals;
        }

        // Get participant data for a specific person
        public ParticipantData GetParticipantData(List<StepEntry> entries, string participantName)
        {
            var data = new ParticipantData
            {
                Name = participantName
            };

            if (entries == null || entries.Count == 0)
            {
                return data;
            }

            foreach (var entry in entries)
            {
                if (entry.Steps.TryGetValue(participantName, out int steps))
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

        // Filter participant data from a specific date
        public ParticipantData FilterParticipantDataFromDate(ParticipantData participantData, List<StepEntry> dailyData, DateTime fromDate)
        {
            if (participantData == null)
                throw new ArgumentNullException(nameof(participantData));
            if (dailyData == null)
                throw new ArgumentNullException(nameof(dailyData));

            var filteredData = new ParticipantData
            {
                Name = participantData.Name
            };

            // Calculate the day index from the fromDate
            // The data starts from January 1st, 2025
            var startOfYear = new DateTime(2025, 1, 1);
            var dayOffset = (fromDate - startOfYear).Days;

            // Ensure dayOffset is within bounds
            if (dayOffset < 0)
            {
                dayOffset = 0;
            }
            
            if (dayOffset >= dailyData.Count)
            {
                dayOffset = Math.Max(0, dailyData.Count - 1);
            }

            // Filter daily steps from the specified date
            var filteredDailySteps = new List<int>();
            var filteredTotalSteps = 0;
            var filteredHighestSingleDay = 0;

            // Start from the calculated day offset
            for (int i = dayOffset; i < dailyData.Count && i < participantData.DailySteps.Count; i++)
            {
                var steps = participantData.DailySteps[i];
                filteredDailySteps.Add(steps);
                filteredTotalSteps += steps;
                filteredHighestSingleDay = Math.Max(filteredHighestSingleDay, steps);
            }

            // Set the filtered data
            filteredData.TotalSteps = filteredTotalSteps;
            filteredData.AverageSteps = filteredDailySteps.Count > 0 ? (double)filteredTotalSteps / filteredDailySteps.Count : 0;
            filteredData.HighestSingleDay = filteredHighestSingleDay;

            // Recalculate streaks and wins for the filtered period
            var filteredDailyData = dailyData.Skip(dayOffset).ToList();
            // Get all participants from the first daily data entry
            var allParticipants = dailyData.FirstOrDefault()?.Steps.Keys.ToList() ?? new List<string>();
            CalculateStreaksAndWins(filteredData, filteredDailyData, allParticipants);

            // Clear the daily steps list since frontend doesn't use it
            filteredData.DailySteps.Clear();

            return filteredData;
        }
    }
}
