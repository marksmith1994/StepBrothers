import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getTheme } from './theme';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PersonPage from './pages/PersonPage';
import GamificationPage from './pages/GamificationPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStepsData } from './hooks/useStepsData';
import { Container } from '@mui/material';
import './App.css';
import './styles/common.css';

export default function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const theme = React.useMemo(() => getTheme(darkMode), [darkMode]);
  
  // Fetch data for NavBar participants
  const { data: stepData } = useStepsData();
  const people = React.useMemo(() => {
    if (stepData && stepData.participants) {
      return stepData.participants;
    }
    return [];
  }, [stepData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar people={people} darkMode={darkMode} onToggleTheme={() => setDarkMode(m => !m)} />
          <Container maxWidth={false} disableGutters style={{ 
            marginTop: 0, 
            padding: 0, 
            flex: 1,
            minHeight: 'calc(100vh - 64px)' // Account for mobile navbar height
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gamification" element={<GamificationPage />} />
              <Route path="/person/:name" element={<PersonPage />} />
            </Routes>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
} 