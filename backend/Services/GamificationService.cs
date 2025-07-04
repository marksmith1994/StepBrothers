using StepTracker.Interfaces;
using StepTracker.Models;

namespace StepTracker.Services
{
    public class GamificationService : IGamificationService
    {
        public GamificationData CalculateGamificationData(List<StepEntry> dailyData, List<string> participants)
        {
            return new GamificationData
            {
                MonthlyWinners = CalculateMonthlyWinners(dailyData, participants),
                AllTimeBests = CalculateAllTimeBests(dailyData, participants),
                CumulativeData = CalculateCumulativeData(dailyData, participants),
                CurrentStreaks = CalculateCurrentStreaks(dailyData, participants)
            };
        }

        public List<MonthlyWinner> CalculateMonthlyWinners(List<StepEntry> dailyData, List<string> participants)
        {
            var monthlyWinners = new List<MonthlyWinner>();

            if (dailyData == null || participants == null || dailyData.Count == 0 || participants.Count == 0)
            {
                return monthlyWinners;
            }

            // Group data by month (assuming 30 days per month)
            const int daysPerMonth = 30;
            var monthlyData = new Dictionary<int, List<StepEntry>>();

            for (int i = 0; i < dailyData.Count; i += daysPerMonth)
            {
                var monthIndex = (i / daysPerMonth) + 1;
                var monthEntries = dailyData.Skip(i).Take(daysPerMonth).ToList();
                monthlyData[monthIndex] = monthEntries;
            }

            // Calculate winner for each month
            foreach (var month in monthlyData)
            {
                var monthTotals = new Dictionary<string, int>();

                // Calculate total steps for each participant in this month
                foreach (var participant in participants)
                {
                    var totalSteps = month.Value
                        .Where(entry => entry.Steps.ContainsKey(participant))
                        .Sum(entry => entry.Steps[participant]);

                    if (totalSteps > 0)
                    {
                        monthTotals[participant] = totalSteps;
                    }
                }

                // Find the winner for this month
                if (monthTotals.Any())
                {
                    var winner = monthTotals.OrderByDescending(kvp => kvp.Value).First();
                    var monthName = GetMonthName(month.Key);

                    monthlyWinners.Add(new MonthlyWinner
                    {
                        Month = monthName,
                        Winner = winner.Key,
                        Steps = winner.Value,
                        DaysInMonth = month.Value.Count
                    });
                }
            }

            return monthlyWinners.OrderBy(w => GetMonthOrder(w.Month)).ToList();
        }

        private string GetMonthName(int monthNumber)
        {
            return monthNumber switch
            {
                1 => "January",
                2 => "February",
                3 => "March",
                4 => "April",
                5 => "May",
                6 => "June",
                7 => "July",
                8 => "August",
                9 => "September",
                10 => "October",
                11 => "November",
                12 => "December",
                _ => $"Month {monthNumber}"
            };
        }

        private int GetMonthOrder(string monthName)
        {
            return monthName switch
            {
                "January" => 1,
                "February" => 2,
                "March" => 3,
                "April" => 4,
                "May" => 5,
                "June" => 6,
                "July" => 7,
                "August" => 8,
                "September" => 9,
                "October" => 10,
                "November" => 11,
                "December" => 12,
                _ => 99
            };
        }

        public List<AllTimeBest> CalculateAllTimeBests(List<StepEntry> dailyData, List<string> participants)
        {
            var allTimeBests = new List<AllTimeBest>();

            if (dailyData == null || participants == null || dailyData.Count == 0 || participants.Count == 0)
            {
                return allTimeBests;
            }

            // Find the highest single-day step count for each participant
            foreach (var participant in participants)
            {
                var bestDay = dailyData
                    .Where(entry => entry.Steps.ContainsKey(participant) && entry.Steps[participant] > 0)
                    .OrderByDescending(entry => entry.Steps[participant])
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

            // Sort by steps in descending order
            return allTimeBests.OrderByDescending(best => best.Steps).ToList();
        }

        public List<CumulativeData> CalculateCumulativeData(List<StepEntry> dailyData, List<string> participants)
        {
            var cumulativeData = new List<CumulativeData>();

            if (dailyData == null || participants == null || dailyData.Count == 0 || participants.Count == 0)
            {
                return cumulativeData;
            }

            // Calculate running totals for each day
            var runningTotals = new Dictionary<string, int>();
            foreach (var participant in participants)
            {
                runningTotals[participant] = 0;
            }

            foreach (var entry in dailyData.OrderBy(e => e.Day))
            {
                var dayCumulative = new CumulativeData
                {
                    Day = entry.Day,
                    CumulativeSteps = new Dictionary<string, int>()
                };

                // Add each participant's cumulative steps for this day
                foreach (var participant in participants)
                {
                    if (entry.Steps.ContainsKey(participant))
                    {
                        runningTotals[participant] += entry.Steps[participant];
                    }
                    dayCumulative.CumulativeSteps[participant] = runningTotals[participant];
                }

                cumulativeData.Add(dayCumulative);
            }

            return cumulativeData;
        }

        public Dictionary<string, int> CalculateCurrentStreaks(List<StepEntry> dailyData, List<string> participants)
        {
            var currentStreaks = new Dictionary<string, int>();

            if (dailyData == null || participants == null || dailyData.Count == 0 || participants.Count == 0)
            {
                return currentStreaks;
            }

            // Calculate current win streaks for each participant
            foreach (var participant in participants)
            {
                var currentStreak = 0;
                var orderedData = dailyData.OrderByDescending(e => e.Day).ToList();

                foreach (var entry in orderedData)
                {
                    if (entry.Steps.ContainsKey(participant) && entry.Steps[participant] > 0)
                    {
                        // Check if this participant won this day
                        var maxSteps = entry.Steps.Values.Max();
                        if (entry.Steps[participant] == maxSteps)
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
                        break; // No steps recorded, streak broken
                    }
                }

                if (currentStreak > 0)
                {
                    currentStreaks[participant] = currentStreak;
                }
            }

            return currentStreaks;
        }
    }
}
