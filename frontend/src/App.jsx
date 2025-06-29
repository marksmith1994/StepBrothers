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
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const theme = React.useMemo(() => getTheme(false), []);
  
  // Fetch data for NavBar participants
  const { data: stepData } = useStepsData();
  const people = React.useMemo(() => {
    if (stepData && stepData.participants) {
      return stepData.participants;
    }
    return [];
  }, [stepData]);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            backgroundColor: 'background.default'
          }}>
            <NavBar people={people} />
            <Container 
              maxWidth={false} 
              disableGutters 
              sx={{ 
                flex: 1,
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2, sm: 3 },
                minHeight: 'calc(100vh - 64px)',
                '@media (min-width: 600px)': {
                  minHeight: 'calc(100vh - 80px)'
                }
              }}
            >
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
    </ErrorBoundary>
  );
} 