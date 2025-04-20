import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useStepsData } from '../hooks/useStepsData';
import { useState } from 'react';

const TABS = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
];

export default function Dashboard({ tab, setTab }) {
  const navigate = useNavigate();
  const { data: steps, loading, error } = useStepsData({ tab });

  let columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'month', headerName: 'Month', flex: 1 },
  ];
  let rows = [];

  if (steps.length > 0) {
    // Only include valid person columns (not id, month, total, not blank, not single-char, not all digits)
    const people = steps[0].steps
      ? Object.keys(steps[0].steps)
      : Object.keys(steps[0]).filter(k => {
          if (!k) return false;
          if (["id","month","total"].includes(k)) return false;
          if (k.length < 2) return false;
          if (/^\d+$/.test(k)) return false;
          return true;
        });
    columns = [
      { field: 'id', headerName: 'ID', flex: 0.5 },
      { field: 'month', headerName: 'Month', flex: 1 },
      ...people.map(person => ({
        field: person,
        headerName: person.charAt(0).toUpperCase() + person.slice(1),
        flex: 1,
        renderCell: (params) => {
          const row = params.row;
          const values = people.map(p => Number(row[p]?.toString().replace(/,/g, '')) || 0).filter(v => !isNaN(v));
          const max = Math.max(...values);
          const isMax = Number(row[person]?.toString().replace(/,/g, '')) === max && max !== -Infinity;
          const formatted = row[person] ? Number(row[person].toString().replace(/,/g, '')).toLocaleString() : '';
          return (
            <Typography component="span" sx={{ fontWeight: isMax ? 700 : 400, color: isMax ? 'primary.main' : 'inherit' }}>
              {formatted}
            </Typography>
          );
        }
      })),
      { field: 'total', headerName: 'Total', flex: 1 },
    ];

    rows = steps.map((entry, idx) => {
      const row = {
        id: idx + 1,
        month: entry.month,
        total: entry.total,
      };
      (people || []).forEach(person => {
        row[person] = entry.steps ? entry.steps[person] ?? '' : entry[person] ?? '';
      });
      return row;
    });
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto', background: '#fff', p: { xs: 1, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom>
        Step Dashboard
      </Typography>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="tab-select-label">Select Tab/Month</InputLabel>
        <Select
          labelId="tab-select-label"
          value={tab}
          label="Select Tab/Month"
          onChange={e => setTab(e.target.value)}
        >
          {TABS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 16, 32]}
          disableSelectionOnClick
        />
      )}
    </Box>
  );
}
