import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Button, 
  Box, 
  useTheme, 
  useMediaQuery,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate, useLocation } from 'react-router-dom';
import { getInitials } from '../utils/helpers';
import { BREAKPOINTS } from '../constants';

export default function NavBar({ people = [], darkMode, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(BREAKPOINTS.MOBILE));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || (path === '/' && location.pathname === '/dashboard');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon />, description: 'View step data and leaderboard' },
    { label: 'Gamification', path: '/gamification', icon: <EmojiEventsIcon />, description: 'Competitions and achievements' }
  ];

  const buttonStyle = (isActive = false) => ({
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 3,
    px: 3,
    py: 1.5,
    fontSize: '0.95rem',
    letterSpacing: 0.5,
    background: isActive 
      ? 'rgba(255,255,255,0.25)' 
      : 'rgba(255,255,255,0.12)',
    boxShadow: isActive 
      ? '0 4px 12px rgba(0,0,0,0.15)' 
      : '0 2px 8px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(10px)',
    border: isActive 
      ? '1px solid rgba(255,255,255,0.3)' 
      : '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { 
      background: 'rgba(255,255,255,0.25)',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
    }
  });

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ 
        minHeight: { xs: 64, sm: 80 }, 
        px: 0, 
        width: '100%', 
        boxSizing: 'border-box', 
        justifyContent: 'center' 
      }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: 1600, 
          display: 'flex', 
          alignItems: 'center', 
          px: { xs: 2, sm: 4, md: 6 } 
        }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 2,
                background: 'rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }}
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Brand */}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              letterSpacing: { xs: 0.5, sm: 1.5 },
              cursor: 'pointer',
              color: '#fff',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              textAlign: 'left',
              pl: { xs: 0, sm: 1 },
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                textShadow: '0 6px 16px rgba(0,0,0,0.4)'
              }
            }}
            onClick={() => navigate('/')}
            aria-label="Go to Dashboard"
          >
            {isMobile ? 'Step Bros' : 'Step Brothers'}
          </Typography>

          {/* Navigation Items */}
          {people.length > 0 && (
            isMobile ? (
              <Menu
                id="mobile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 280,
                    maxWidth: 320,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }
                }}
              >
                {/* Navigation Items */}
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      handleClose();
                    }}
                    sx={{ 
                      fontWeight: 600, 
                      letterSpacing: 0.5, 
                      fontSize: '1rem', 
                      py: 2,
                      px: 3,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      background: isActiveRoute(item.path) 
                        ? 'rgba(102, 126, 234, 0.1)' 
                        : 'transparent',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.05)'
                      }
                    }}
                  >
                    <Box sx={{ mr: 2, color: isActiveRoute(item.path) ? theme.palette.primary.main : 'inherit' }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                
                <Divider sx={{ my: 1 }} />
                
                {/* People */}
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Participants
                  </Typography>
                </Box>
                
                {people.slice(0, 6).map((person) => (
                  <MenuItem
                    key={person}
                    onClick={() => {
                      navigate(`/person/${encodeURIComponent(person)}`);
                      handleClose();
                    }}
                    aria-label={`Go to ${person}'s page`}
                    sx={{ 
                      fontWeight: 600, 
                      letterSpacing: 0.5, 
                      fontSize: '0.9rem', 
                      py: 1.5,
                      px: 3,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.25,
                      background: isActiveRoute(`/person/${encodeURIComponent(person)}`) 
                        ? 'rgba(102, 126, 234, 0.1)' 
                        : 'transparent',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.05)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        mr: 2, 
                        fontSize: '0.75rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {getInitials(person)}
                    </Avatar>
                    <Typography variant="body2" sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {person}
                    </Typography>
                  </MenuItem>
                ))}
                
                {people.length > 6 && (
                  <MenuItem
                    sx={{ 
                      textAlign: 'center',
                      py: 1,
                      px: 3,
                      mx: 1,
                      my: 0.25,
                      color: 'text.secondary',
                      fontSize: '0.8rem'
                    }}
                  >
                    +{people.length - 6} more participants
                  </MenuItem>
                )}
              </Menu>
            ) : (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {/* Main Navigation */}
                {navItems.map((item) => (
                  <Tooltip key={item.path} title={item.description} arrow>
                    <Button
                      color="inherit"
                      onClick={() => navigate(item.path)}
                      sx={buttonStyle(isActiveRoute(item.path))}
                      startIcon={item.icon}
                    >
                      {item.label}
                    </Button>
                  </Tooltip>
                ))}
                
                <Divider orientation="vertical" flexItem sx={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  mx: 1,
                  height: 32
                }} />
                
                {/* People */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {people.map((person) => (
                    <Tooltip key={person} title={`View ${person}'s stats`} arrow>
                      <Button
                        color="inherit"
                        onClick={() => navigate(`/person/${encodeURIComponent(person)}`)}
                        sx={buttonStyle(isActiveRoute(`/person/${encodeURIComponent(person)}`))}
                        aria-label={`Go to ${person}'s page`}
                      >
                        <Avatar 
                          sx={{
                            width: 28, 
                            height: 28, 
                            mr: 1.5, 
                            fontSize: '0.75rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        >
                          {getInitials(person)}
                        </Avatar>
                        {person}
                      </Button>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
