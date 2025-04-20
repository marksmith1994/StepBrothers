import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import PersonPage from './components/PersonPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStepsData } from './hooks/useStepsData';
import { Container, Typography } from '@mui/material';
import './App.css';

export default function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const theme = React.useMemo(() => getTheme(darkMode), [darkMode]);
  // Fetch people list for NavBar
  const { data: steps } = useStepsData();
  const people = React.useMemo(() => (steps.length > 0 ? Object.keys(steps[0].steps) : []), [steps]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar people={people} darkMode={darkMode} onToggleTheme={() => setDarkMode(m => !m)} />
        <Container maxWidth="lg" style={{ marginTop: 40 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Step Brothers Dashboard
          </Typography>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/person/:name" element={<PersonPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}
