import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Chip,
  useTheme,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  TextField,
  Switch
} from '@mui/material';
import { getInitials, formatNumber } from '../utils/helpers';
import { useStepsData } from '../hooks/useStepsData';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function ComparisonTable({ currentPerson }) {
  const theme = useTheme();
  const [selectedPerson, setSelectedPerson] = useState('');
  const [allParticipants, setAllParticipants] = useState([]);
  const [startDate, setStartDate] = useState(new Date(2025, 0, 1)); // January 1st, 2025
  const [isCumulative, setIsCumulative] = useState(false); // Switch for cumulative vs monthly totals
  
  // Fetch all participants data
  const { data: allData, loading, error } = useStepsData();
  
  // Fetch selected person's data
  const { data: selectedPersonData } = useStepsData(selectedPerson ? { 
    person: selectedPerson,
    fromDate: startDate
  } : { person: null });

  // Get filtered data for current person (we'll need to fetch this separately with date filter)
  const { data: filteredCurrentPersonData } = useStepsData({ 
    person: currentPerson,
    fromDate: startDate
  });

  // Fetch full year data for monthly calculations (no date filter)
  const { data: fullYearCurrentPersonData } = useStepsData({ 
    person: currentPerson
  });
  const { data: fullYearSelectedPersonData } = useStepsData(selectedPerson ? { 
    person: selectedPerson
  } : { person: null });

  // Calculate monthly cumulative totals
  const calculateMonthlyTotals = (personData) => {
    if (!personData || !personData.dailySteps) return [];
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Group daily steps by month (using full year data, not filtered by startDate)
    const monthlySteps = {};
    
    personData.dailySteps.forEach((steps, index) => {
      // Calculate the actual date based on January 1st, 2025 + index
      const date = new Date(2025, 0, 1);
      date.setDate(date.getDate() + index);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthlySteps[monthKey]) {
        monthlySteps[monthKey] = {
          month: months[date.getMonth()],
          year: date.getFullYear(),
          totalSteps: 0,
          days: 0
        };
      }
      
      monthlySteps[monthKey].totalSteps += steps;
      monthlySteps[monthKey].days += 1;
    });
    
    // Convert to array and sort by date
    const sortedMonths = Object.values(monthlySteps)
      .sort((a, b) => a.year - b.year || months.indexOf(a.month) - months.indexOf(b.month));
    
    // If cumulative mode is enabled, calculate running totals
    if (isCumulative) {
      let runningTotal = 0;
      return sortedMonths.map(month => {
        runningTotal += month.totalSteps;
        return {
          ...month,
          totalSteps: runningTotal
        };
      });
    }
    
    return sortedMonths;
  };

  // Use full year data for monthly calculations (not filtered by startDate)
  const currentPersonMonthlyTotals = calculateMonthlyTotals(fullYearCurrentPersonData);
  const selectedPersonMonthlyTotals = calculateMonthlyTotals(fullYearSelectedPersonData);

  useEffect(() => {
    if (allData && allData.participants) {
      // Filter out the current person from the dropdown
      const otherParticipants = allData.participants.filter(
        person => person !== currentPerson
      );
      setAllParticipants(otherParticipants);
      
      // Set the first person as default selection if none selected
      if (!selectedPerson && otherParticipants.length > 0) {
        setSelectedPerson(otherParticipants[0]);
      }
    }
  }, [allData, currentPerson, selectedPerson]);

  const getComparisonValue = (currentValue, selectedValue, isHigherBetter = true) => {
    if (currentValue === selectedValue) return 'tie';
    if (isHigherBetter) {
      return currentValue > selectedValue ? 'better' : 'worse';
    } else {
      return currentValue < selectedValue ? 'better' : 'worse';
    }
  };

  const getComparisonIcon = (comparison) => {
    switch (comparison) {
      case 'better':
        return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
      case 'worse':
        return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
      case 'tie':
        return <CompareArrowsIcon sx={{ color: theme.palette.info.main }} />;
      default:
        return null;
    }
  };

  const getComparisonColor = (comparison) => {
    switch (comparison) {
      case 'better':
        return theme.palette.success.main;
      case 'worse':
        return theme.palette.error.main;
      case 'tie':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getComparisonText = (comparison) => {
    switch (comparison) {
      case 'better':
        return 'Better';
      case 'worse':
        return 'Worse';
      case 'tie':
        return 'Tied';
      default:
        return '';
    }
  };

  const comparisonMetrics = [
    {
      label: 'Total Steps',
      currentValue: filteredCurrentPersonData?.totalSteps || 0,
      selectedValue: selectedPersonData?.totalSteps || 0,
      format: (value) => formatNumber(value),
      icon: <StarIcon />,
      isHigherBetter: true
    },
    {
      label: 'Average Steps/Day',
      currentValue: Math.round(filteredCurrentPersonData?.averageSteps || 0),
      selectedValue: Math.round(selectedPersonData?.averageSteps || 0),
      format: (value) => formatNumber(value),
      icon: <TrendingUpIcon />,
      isHigherBetter: true
    },
    {
      label: 'Highest Single Day',
      currentValue: filteredCurrentPersonData?.highestSingleDay || 0,
      selectedValue: selectedPersonData?.highestSingleDay || 0,
      format: (value) => formatNumber(value),
      icon: <LocalFireDepartmentIcon />,
      isHigherBetter: true
    },
    {
      label: 'Best Win Streak',
      currentValue: filteredCurrentPersonData?.bestWinStreak || 0,
      selectedValue: selectedPersonData?.bestWinStreak || 0,
      format: (value) => value,
      icon: <LocalFireDepartmentIcon />,
      isHigherBetter: true
    },
    {
      label: 'All-Time Wins',
      currentValue: filteredCurrentPersonData?.allTimeWins || 0,
      selectedValue: selectedPersonData?.allTimeWins || 0,
      format: (value) => value,
      icon: <EmojiEventsIcon />,
      isHigherBetter: true
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: 'center', 
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 3
          }}
        >
          📊 Compare Performance
        </Typography>
        
        {/* Date Range Selector - Mobile First */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            gap: { xs: 2, sm: 3 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              minWidth: { xs: 'auto', sm: '200px' }
            }}>
              <CalendarTodayIcon sx={{ 
                color: theme.palette.primary.main,
                fontSize: { xs: 20, sm: 24 }
              }} />
              <Typography variant="body1" sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}>
                Compare from:
              </Typography>
            </Box>
            <TextField
              type="date"
              value={startDate instanceof Date && !isNaN(startDate) ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const newDate = new Date(val);
                  if (!startDate || startDate.getTime() !== newDate.getTime()) {
                    setStartDate(newDate);
                  }
                }
              }}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,1)'
                  }
                }
              }}
              inputProps={{
                min: '2025-01-01',
                max: '2025-12-31'
              }}
            />
          </Box>
        </Paper>
        
        {/* Person Selection - Mobile Optimized */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            gap: { xs: 3, sm: 4 }
          }}>
            {/* Current Person */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'row', sm: 'row' }, 
              alignItems: 'center', 
              gap: 2,
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 40, sm: 50 }, 
                  height: { xs: 40, sm: 50 }, 
                  fontSize: { xs: 16, sm: 20 }, 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {getInitials(currentPerson)}
              </Avatar>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                {currentPerson}
              </Typography>
            </Box>
            
            {/* VS Indicator */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              px: { xs: 0, sm: 2 }
            }}>
              <CompareArrowsIcon sx={{ 
                fontSize: { xs: 24, sm: 32 }, 
                color: theme.palette.primary.main,
                transform: { xs: 'rotate(90deg)', sm: 'rotate(0deg)' }
              }} />
            </Box>
            
            {/* Selected Person */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: { xs: 'stretch', sm: 'center' }, 
              gap: 2,
              flex: 1
            }}>
              <FormControl fullWidth>
                <Select
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      py: { xs: 1.5, sm: 1 }
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)'
                      }
                    }
                  }}
                >
                  {allParticipants.map((person) => (
                    <MenuItem key={person} value={person}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ 
                            width: { xs: 20, sm: 24 }, 
                            height: { xs: 20, sm: 24 }, 
                            fontSize: { xs: 10, sm: 12 },
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        >
                          {getInitials(person)}
                        </Avatar>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          {person}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Comparison Table - Mobile Optimized */}
      <Paper sx={{ 
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <TableContainer sx={{ 
          maxHeight: { xs: 'none', sm: 600 },
          overflowX: 'auto'
        }}>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  minWidth: { xs: 80, sm: 120 }
                }}>
                  Metric
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  textAlign: 'center',
                  minWidth: { xs: 70, sm: 100 }
                }}>
                  {currentPerson}
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  textAlign: 'center',
                  minWidth: { xs: 70, sm: 100 }
                }}>
                  {selectedPerson}
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  textAlign: 'center',
                  minWidth: { xs: 80, sm: 120 }
                }}>
                  Comparison
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonMetrics.map((metric, index) => {
                const comparison = getComparisonValue(
                  metric.currentValue, 
                  metric.selectedValue, 
                  metric.isHigherBetter
                );
                
                return (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {React.cloneElement(metric.icon, { 
                          sx: { fontSize: { xs: 16, sm: 20 } }
                        })}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '0.8rem', sm: '1rem' }
                          }}
                        >
                          {metric.label}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          fontSize: { xs: '0.9rem', sm: '1.25rem' }
                        }}
                      >
                        {metric.format(metric.currentValue)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: theme.palette.secondary.main,
                          fontSize: { xs: '0.9rem', sm: '1.25rem' }
                        }}
                      >
                        {metric.format(metric.selectedValue)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        {React.cloneElement(getComparisonIcon(comparison), {
                          sx: { fontSize: { xs: 16, sm: 20 } }
                        })}
                        <Chip
                          label={getComparisonText(comparison)}
                          size="small"
                          sx={{
                            backgroundColor: getComparisonColor(comparison) + '20',
                            color: getComparisonColor(comparison),
                            fontWeight: 600,
                            border: `1px solid ${getComparisonColor(comparison)}40`,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Monthly Cumulative Totals Table */}
      <Paper sx={{ 
        mt: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ 
          p: 3, 
          pb: 0, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            📈 {isCumulative ? 'Cumulative' : 'Monthly'} Totals
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Monthly
            </Typography>
            <Switch
              checked={isCumulative}
              onChange={(e) => setIsCumulative(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.primary.main,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Cumulative
            </Typography>
          </Box>
        </Box>
        <TableContainer sx={{ 
          maxHeight: { xs: 'none', sm: 600 },
          overflowX: 'auto'
        }}>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  minWidth: { xs: 80, sm: 120 }
                }}>
                  Month
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  textAlign: 'center',
                  minWidth: { xs: 70, sm: 100 }
                }}>
                  {currentPerson}
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  textAlign: 'center',
                  minWidth: { xs: 70, sm: 100 }
                }}>
                  {selectedPerson}
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.8rem', sm: '1rem' }, 
                  textAlign: 'center',
                  minWidth: { xs: 80, sm: 120 }
                }}>
                  Difference
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                // Combine both people's monthly data and sort by date
                const allMonths = new Set();
                currentPersonMonthlyTotals.forEach(item => allMonths.add(`${item.year}-${item.month}`));
                selectedPersonMonthlyTotals.forEach(item => allMonths.add(`${item.year}-${item.month}`));
                
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
                
                return Array.from(allMonths)
                  .map(monthKey => {
                    const [year, month] = monthKey.split('-');
                    return { year: parseInt(year), month };
                  })
                  .sort((a, b) => a.year - b.year || months.indexOf(a.month) - months.indexOf(b.month))
                  .map(({ year, month }) => {
                    const currentPersonData = currentPersonMonthlyTotals.find(
                      item => item.year === year && item.month === month
                    );
                    const selectedPersonData = selectedPersonMonthlyTotals.find(
                      item => item.year === year && item.month === month
                    );
                    
                    const currentSteps = currentPersonData?.totalSteps || 0;
                    const selectedSteps = selectedPersonData?.totalSteps || 0;
                    const difference = currentSteps - selectedSteps;
                    const isWinning = difference > 0;
                    const isLosing = difference < 0;
                    
                    return (
                      <TableRow key={`${year}-${month}`} hover>
                        <TableCell>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 700,
                              fontSize: { xs: '0.8rem', sm: '1rem' }
                            }}
                          >
                            {month} {year}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              fontSize: { xs: '0.9rem', sm: '1.25rem' }
                            }}
                          >
                            {formatNumber(currentSteps)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            {currentPersonData?.days || 0} days
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: theme.palette.secondary.main,
                              fontSize: { xs: '0.9rem', sm: '1.25rem' }
                            }}
                          >
                            {formatNumber(selectedSteps)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            {selectedPersonData?.days || 0} days
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' }
                          }}>
                            {isWinning && <TrendingUpIcon sx={{ color: theme.palette.success.main, fontSize: { xs: 16, sm: 20 } }} />}
                            {isLosing && <TrendingDownIcon sx={{ color: theme.palette.error.main, fontSize: { xs: 16, sm: 20 } }} />}
                            {!isWinning && !isLosing && <CompareArrowsIcon sx={{ color: theme.palette.info.main, fontSize: { xs: 16, sm: 20 } }} />}
                            <Chip
                              label={`${isWinning ? '+' : ''}${formatNumber(difference)}`}
                              size="small"
                              sx={{
                                backgroundColor: isWinning 
                                  ? theme.palette.success.main + '20' 
                                  : isLosing 
                                    ? theme.palette.error.main + '20'
                                    : theme.palette.info.main + '20',
                                color: isWinning 
                                  ? theme.palette.success.main 
                                  : isLosing 
                                    ? theme.palette.error.main
                                    : theme.palette.info.main,
                                fontWeight: 600,
                                border: `1px solid ${isWinning 
                                  ? theme.palette.success.main + '40' 
                                  : isLosing 
                                    ? theme.palette.error.main + '40'
                                    : theme.palette.info.main + '40'}`,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  });
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.success.main,
                mb: 1
              }}>
                {comparisonMetrics.filter(m => 
                  getComparisonValue(m.currentValue, m.selectedValue, m.isHigherBetter) === 'better'
                ).length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                Areas You Lead
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.info.main,
                mb: 1
              }}>
                {comparisonMetrics.filter(m => 
                  getComparisonValue(m.currentValue, m.selectedValue, m.isHigherBetter) === 'tie'
                ).length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                Tied Areas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: theme.palette.error.main,
                mb: 1
              }}>
                {comparisonMetrics.filter(m => 
                  getComparisonValue(m.currentValue, m.selectedValue, m.isHigherBetter) === 'worse'
                ).length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                Areas to Improve
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 