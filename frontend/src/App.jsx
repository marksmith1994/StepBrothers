import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import PersonPage from './pages/PersonPage';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStepsData } from './hooks/useStepsData';
import { Container } from '@mui/material';
import './App.css';

export default function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const theme = React.useMemo(() => getTheme(darkMode), [darkMode]);
  // Fetch people list for NavBar
  const { data: steps } = useStepsData();
  const people = React.useMemo(() => (
    steps.length > 0
      ? Object.keys(steps[0]).filter(
          k => !['id', 'month', 'total', 'date'].includes(k) && k.length > 1 && !/^\d+$/.test(k)
        )
      : []
  ), [steps]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar people={people} darkMode={darkMode} onToggleTheme={() => setDarkMode(m => !m)} />
        <Container maxWidth={false} disableGutters style={{ marginTop: 40, padding: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/person/:name" element={<PersonPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}
