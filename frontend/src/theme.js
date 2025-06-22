import { createTheme } from '@mui/material/styles';

// Color palette
const colors = {
  primary: {
    main: '#2563eb',
    light: '#3b82f6',
    dark: '#1d4ed8',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#7c3aed',
    light: '#8b5cf6',
    dark: '#6d28d9',
    contrastText: '#ffffff'
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb'
  },
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// Typography
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 800,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em'
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em'
  },
  h3: {
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em'
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.4
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.025em'
  }
};

// Component overrides
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '10px 24px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-1px)'
        }
      },
      contained: {
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
        }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)'
        }
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          fontWeight: 700,
          fontSize: '0.875rem',
          color: colors.grey[700]
        }
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${colors.grey[200]}`,
        padding: '16px'
      }
    }
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontWeight: 700
      }
    }
  }
};

export function getTheme(darkMode = false) {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
      grey: colors.grey,
      background: {
        default: darkMode ? colors.grey[900] : colors.grey[50],
        paper: darkMode ? colors.grey[800] : '#ffffff'
      },
      text: {
        primary: darkMode ? colors.grey[100] : colors.grey[900],
        secondary: darkMode ? colors.grey[400] : colors.grey[600]
      }
    },
    typography,
    components,
    shape: {
      borderRadius: 12
    },
    shadows: [
      'none',
      '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
      '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
      '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
      '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      ...Array(19).fill('none')
    ]
  });
}
