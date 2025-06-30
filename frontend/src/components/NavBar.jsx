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
  Divider,
  ListItemIcon,
  ListItemText,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useLocation } from 'react-router-dom';
import { getInitials } from '../utils/helpers';

export default function NavBar({ people = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const [participantsAnchorEl, setParticipantsAnchorEl] = React.useState(null);
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMobileMenu = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileClose = () => {
    setMobileAnchorEl(null);
  };

  const handleParticipantsMenu = (event) => {
    setParticipantsAnchorEl(event.currentTarget);
  };

  const handleParticipantsClose = () => {
    setParticipantsAnchorEl(null);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || (path === '/' && location.pathname === '/dashboard');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon />, description: 'View step data and leaderboard' },
    { label: 'Gamification', path: '/gamification', icon: <EmojiEventsIcon />, description: 'Competitions and achievements' }
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(90deg, #232526 0%, #314755 100%)',
        color: '#fff',
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <Toolbar sx={{ 
        minHeight: { xs: 64, sm: 80 }, 
        px: { xs: 2, sm: 3, md: 4 }, 
        justifyContent: 'space-between',
        maxWidth: '100%'
      }}>
        {/* Logo/Brand */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 900,
            letterSpacing: { xs: 0.5, sm: 1 },
            cursor: 'pointer',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }
          }}
          onClick={() => navigate('/')}
          aria-label="Go to Dashboard"
        >
          {isMobile ? 'Step Bros' : 'Step Brothers'}
        </Typography>

        {/* Navigation Items - Desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Tooltip key={item.path} title={item.description} arrow>
                <Button
                  variant={isActiveRoute(item.path) ? "contained" : "outlined"}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.5)'
                    },
                    '&.MuiButton-contained': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }
                    }
                  }}
                >
                  {item.label}
                </Button>
              </Tooltip>
            ))}
            
            {people.length > 0 && (
              <>
                <Divider orientation="vertical" flexItem sx={{ 
                  background: 'rgba(255,255,255,0.3)', 
                  mx: 1,
                  height: 32
                }} />
                
                <Tooltip title="View participants" arrow>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleParticipantsMenu}
                    startIcon={<PeopleIcon />}
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.5)'
                      }
                    }}
                  >
                    Participants
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="menu"
            sx={{ 
              background: 'rgba(255,255,255,0.1)',
              '&:hover': { background: 'rgba(255,255,255,0.2)' },
              minWidth: '44px',
              minHeight: '44px'
            }}
            onClick={handleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileAnchorEl}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {navItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => {
              navigate(item.path);
              handleMobileClose();
            }}
            selected={isActiveRoute(item.path)}
            sx={{ 
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </MenuItem>
        ))}
        
        {people.length > 0 && [
          <Divider key="divider" sx={{ my: 1 }} />,
          ...people.map((person) => (
            <MenuItem
              key={person}
              onClick={() => {
                navigate(`/person/${encodeURIComponent(person)}`);
                handleMobileClose();
              }}
              selected={location.pathname === `/person/${encodeURIComponent(person)}`}
              sx={{ 
                py: 1.5, 
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    fontSize: '0.875rem',
                    bgcolor: 'primary.main'
                  }}
                >
                  {getInitials(person)}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={person}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>
          ))
        ]}
      </Menu>

      {/* Participants Menu - Desktop Only */}
      {!isMobile && (
        <Menu
          anchorEl={participantsAnchorEl}
          open={Boolean(participantsAnchorEl)}
          onClose={handleParticipantsClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {people.map((person) => (
            <MenuItem
              key={person}
              onClick={() => {
                navigate(`/person/${encodeURIComponent(person)}`);
                handleParticipantsClose();
              }}
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    fontSize: '0.875rem',
                    bgcolor: 'primary.main'
                  }}
                >
                  {getInitials(person)}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={person}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>
          ))}
        </Menu>
      )}
    </AppBar>
  );
}
