import React from 'react';
import { Box, Typography, Tabs, Tab, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, useTheme } from '@mui/material';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { useStepsData } from '../hooks/useStepsData';
import dayjs from 'dayjs';

function getPeopleKeys(entry) {
  // Exclude known non-person fields and filter out empty/single-char/number keys
  return Object.keys(entry).filter(k => {
    if (!k) return false;
    if (["id","month","total","date"].includes(k)) return false;
    if (k.length < 2) return false;
    if (/^\d+$/.test(k)) return false;
    return true;
  });
}

function aggregateSteps(steps, period) {
  // period: 'day' | 'week' | 'month'
  const now = dayjs();
  const result = {};
  for (const entry of steps) {
    let match = false;
    if (period === 'day') {
      match = entry.date && dayjs(entry.date).isSame(now, 'day');
    } else if (period === 'week') {
      match = entry.date && dayjs(entry.date).isSame(now, 'week');
    } else if (period === 'month') {
      match = entry.date && dayjs(entry.date).isSame(now, 'month');
    }
    if (match) {
      for (const person of getPeopleKeys(entry)) {
        result[person] = (result[person] || 0) + (parseInt(entry[person], 10) || 0);
      }
    }
  }
  return result;
}

const medals = [
  { icon: <EmojiEvents sx={{ color: '#FFD700' }} />, label: 'Gold' },
  { icon: <EmojiEvents sx={{ color: '#C0C0C0' }} />, label: 'Silver' },
  { icon: <EmojiEvents sx={{ color: '#CD7F32' }} />, label: 'Bronze' }
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function Leaderboard({ tab = 'dashboard' }) {
  const { data: steps, loading, error } = useStepsData({ tab });
  const [periodTab, setPeriodTab] = React.useState(0);
  const theme = useTheme();
  const periods = ['day', 'week', 'month', 'all'];
  const periodLabels = ['Today', 'This Week', 'This Month', 'All Time'];
  const period = periods[periodTab];

  // When on dashboard tab, aggregate by month (monthly totals)
  // When on a month tab, aggregate by day (daily data for that month)
  let totals;
  if (tab === 'dashboard') {
    // Dashboard: use monthly totals as-is
    totals = {};
    for (const entry of steps) {
      for (const person of getPeopleKeys(entry)) {
        totals[person] = (totals[person] || 0) + (parseInt(entry[person], 10) || 0);
      }
    }
  } else {
    // Month tab: aggregate by selected period
    totals = aggregateSteps(steps, period);
  }
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  return (
    <Paper sx={{ mt: 4, p: { xs: 1.5, sm: 3 }, borderRadius: 3, boxShadow: 3, overflowX: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 800, letterSpacing: 1 }}>Leaderboard</Typography>
      {tab !== 'dashboard' && (
        <Tabs
          value={periodTab}
          onChange={(_, v) => setPeriodTab(v)}
          sx={{ mb: 2, minHeight: 44 }}
          TabIndicatorProps={{ style: { height: 4, borderRadius: 2, background: theme.palette.primary.main } }}
        >
          {periodLabels.map((label, i) => <Tab key={label} label={label} sx={{ fontWeight: 600, fontSize: '1rem' }} />)}
        </Tabs>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Steps</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map(([person, steps], idx) => (
            <TableRow
              key={person}
              sx={idx === 0 ? { background: theme.palette.action.hover, boxShadow: 1 } : {}}
            >
              <TableCell>
                {idx < 3 ? medals[idx].icon : idx + 1}
              </TableCell>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: 18 }}>
                  {getInitials(person)}
                </Avatar>
                <span style={{ fontWeight: idx === 0 ? 700 : 500 }}>{person.charAt(0).toUpperCase() + person.slice(1)}</span>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: idx === 0 ? 700 : 400, fontSize: '1.1rem' }}>
                {typeof steps === 'number' ? steps.toLocaleString() : (Number(steps?.toString().replace(/,/g, '')) || '')?.toLocaleString?.() || steps}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
