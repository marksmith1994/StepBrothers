import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function NavBar({ people = [] }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static" color="primary" elevation={2} sx={{ background: 'linear-gradient(90deg, #283593 0%, #1565c0 100%)', width: '100%' }}>
      <Toolbar sx={{ minHeight: 72, px: 0, width: '100%', boxSizing: 'border-box', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1500, display: 'flex', alignItems: 'center', px: { xs: 2, sm: 8 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'flex', sm: 'none' } }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              letterSpacing: 2,
              cursor: 'pointer',
              color: '#fff',
              textShadow: '0 2px 8px rgba(21,101,192,0.15)',
              textAlign: 'left',
              pl: 1
            }}
            onClick={() => navigate('/')}
            aria-label="Go to Dashboard"
          >
            Step Brothers
          </Typography>
          {people.length > 0 && (
            isMobile ? (
              <Box>
                <Button
                  color="inherit"
                  aria-controls="person-menu"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  startIcon={<MenuIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.10)',
                    boxShadow: '0 1px 4px rgba(21,101,192,0.08)',
                    '&:hover': { background: 'rgba(255,255,255,0.18)' }
                  }}
                >
                  People
                </Button>
                <Menu
                  id="person-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 240,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(21,101,192,0.10)'
                    }
                  }}
                >
                  {people.map((person) => (
                    <MenuItem
                      key={person}
                      onClick={() => {
                        navigate(`/person/${encodeURIComponent(person)}`);
                        handleClose();
                      }}
                      aria-label={`Go to ${person}'s page`}
                      sx={{ fontWeight: 500, letterSpacing: 0.5, fontSize: '1.05rem', py: 1.5 }}
                    >
                      {person}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.2,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.10)',
                    boxShadow: '0 1px 4px rgba(21,101,192,0.08)',
                    '&:hover': { background: 'rgba(255,255,255,0.18)' }
                  }}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.2,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.10)',
                    boxShadow: '0 1px 4px rgba(21,101,192,0.08)',
                    '&:hover': { background: 'rgba(255,255,255,0.18)' }
                  }}
                >
                  Dashboard
                </Button>
                {people.map((person) => (
                  <Button
                    key={person}
                    color="inherit"
                    onClick={() => navigate(`/person/${encodeURIComponent(person)}`)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2.5,
                      py: 1.2,
                      fontSize: '1rem',
                      background: 'rgba(255,255,255,0.10)',
                      boxShadow: '0 1px 4px rgba(21,101,192,0.08)',
                      '&:hover': { background: 'rgba(255,255,255,0.18)' }
                    }}
                    aria-label={`Go to ${person}'s page`}
                  >
                    {person}
                  </Button>
                ))}
              </Box>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
