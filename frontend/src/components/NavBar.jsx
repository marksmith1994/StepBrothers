import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Box, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function NavBar({ people = [], onToggleTheme, darkMode }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
          aria-label="Go to Dashboard"
        >
          Step Brothers
        </Typography>
        {people.length > 0 && (
          <Box>
            <Button
              color="inherit"
              aria-controls="person-menu"
              aria-haspopup="true"
              onClick={handleMenu}
              startIcon={<MenuIcon />}
            >
              People
            </Button>
            <Menu
              id="person-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {people.map((person) => (
                <MenuItem
                  key={person}
                  onClick={() => {
                    navigate(`/person/${encodeURIComponent(person)}`);
                    handleClose();
                  }}
                  aria-label={`Go to ${person}'s page`}
                >
                  {person}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
        <Box sx={{ ml: 2 }}>
          <Typography component="span" variant="body2" sx={{ mr: 1 }}>
            {darkMode ? 'Dark' : 'Light'} Mode
          </Typography>
          <Switch checked={darkMode} onChange={onToggleTheme} inputProps={{ 'aria-label': 'Toggle theme' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
