import { createTheme } from '@mui/material/styles';

// Modern masculine color palette: blue, indigo, teal, deep gray
const colors = {
  primary: {
    main: '#314755', // Deep blue/indigo
    light: '#547085',
    dark: '#232526',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#06b6d4', // Teal/cyan
    light: '#22d3ee',
    dark: '#0891b2',
    contrastText: '#ffffff'
  },
  success: {
    main: '#10b981', // Emerald
    light: '#34d399',
    dark: '#059669'
  },
  warning: {
    main: '#2563eb', // Blue (instead of amber)
    light: '#3b82f6',
    dark: '#1e40af'
  },
  error: {
    main: '#ef4444', // Red
    light: '#f87171',
    dark: '#dc2626'
  },
  info: {
    main: '#0ea5e9', // Sky blue
    light: '#38bdf8',
    dark: '#0369a1'
  },
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
};

// Mobile-first typography with fluid scaling
const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  h1: {
    fontWeight: 800,
    fontSize: 'clamp(1.75rem, 5vw, 3rem)',
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    '@media (max-width: 600px)': {
      fontSize: 'clamp(1.5rem, 6vw, 2.25rem)',
    }
  },
  h2: {
    fontWeight: 700,
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    '@media (max-width: 600px)': {
      fontSize: 'clamp(1.25rem, 5vw, 2rem)',
    }
  },
  h3: {
    fontWeight: 700,
    fontSize: 'clamp(1.25rem, 3.5vw, 2rem)',
    lineHeight: 1.3,
    letterSpacing: '-0.015em',
    '@media (max-width: 600px)': {
      fontSize: 'clamp(1.125rem, 4vw, 1.75rem)',
    }
  },
  h4: {
    fontWeight: 600,
    fontSize: 'clamp(1.125rem, 3vw, 1.75rem)',
    lineHeight: 1.4,
    '@media (max-width: 600px)': {
      fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
    }
  },
  h5: {
    fontWeight: 600,
    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
    lineHeight: 1.4,
    '@media (max-width: 600px)': {
      fontSize: 'clamp(0.875rem, 3vw, 1.25rem)',
    }
  },
  h6: {
    fontWeight: 600,
    fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
    lineHeight: 1.4,
    '@media (max-width: 600px)': {
      fontSize: 'clamp(0.8rem, 2.5vw, 1.125rem)',
    }
  },
  body1: {
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    lineHeight: 1.6,
    '@media (max-width: 600px)': {
      fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    }
  },
  body2: {
    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
    lineHeight: 1.5,
    '@media (max-width: 600px)': {
      fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
    }
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.025em',
    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
    '@media (max-width: 600px)': {
      fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
    }
  },
  caption: {
    fontSize: 'clamp(0.7rem, 1vw, 0.75rem)',
    lineHeight: 1.4,
    '@media (max-width: 600px)': {
      fontSize: 'clamp(0.65rem, 1.2vw, 0.7rem)',
    }
  },
  overline: {
    fontSize: 'clamp(0.65rem, 0.9vw, 0.7rem)',
    lineHeight: 1.4,
    fontWeight: 600,
    '@media (max-width: 600px)': {
      fontSize: 'clamp(0.6rem, 1vw, 0.65rem)',
    }
  }
};

// Modern component overrides with mobile-first design
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '12px 24px',
        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '48px',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          transform: 'translateY(0)'
        },
        '@media (max-width: 600px)': {
          borderRadius: 10,
          padding: '10px 20px',
          minHeight: '44px',
          fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
        }
      },
      contained: {
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
        }
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px'
        }
      },
      sizeSmall: {
        padding: '8px 16px',
        minHeight: '36px',
        fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
        '@media (max-width: 600px)': {
          padding: '6px 12px',
          minHeight: '32px',
          fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
        }
      },
      sizeLarge: {
        padding: '16px 32px',
        minHeight: '56px',
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
        '@media (max-width: 600px)': {
          padding: '14px 28px',
          minHeight: '48px',
          fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)'
        }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
          transform: 'translateY(-2px)'
        },
        '@media (max-width: 600px)': {
          borderRadius: 12,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.2)',
          width: '100%',
          margin: '0',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)'
          }
        }
      }
    }
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px'
        },
        '@media (max-width: 600px)': {
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px'
          }
        }
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        '@media (max-width: 600px)': {
          borderRadius: 12,
          width: '100%',
          margin: '0'
        }
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        '@media (max-width: 600px)': {
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.2)'
        }
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        '@media (max-width: 600px)': {
          boxShadow: '0 1px 10px rgba(0, 0, 0, 0.08)'
        }
      }
    }
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          minHeight: '64px !important'
        }
      }
    }
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          fontWeight: 700,
          fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
          '@media (max-width: 600px)': {
            fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
            padding: '8px 4px'
          }
        }
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
        '@media (max-width: 600px)': {
          fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
          padding: '8px 4px'
        }
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
        height: '28px',
        '@media (max-width: 600px)': {
          fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
          height: '24px'
        }
      }
    }
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          minHeight: '48px'
        }
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
        fontWeight: 600,
        textTransform: 'none',
        minHeight: '48px',
        '@media (max-width: 600px)': {
          fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
          minHeight: '44px',
          padding: '8px 12px'
        }
      }
    }
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          '& .MuiInputLabel-root': {
            fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
          },
          '& .MuiSelect-select': {
            fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
            padding: '12px 14px'
          }
        }
      }
    }
  },
  MuiDataGrid: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          width: '100% !important',
          fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
          '& .MuiDataGrid-cell': {
            padding: '4px 8px'
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '8px 4px'
          }
        }
      }
    }
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
        '@media (max-width: 600px)': {
          borderRadius: 8,
          fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
          padding: '8px 12px'
        }
      }
    }
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          '&.MuiCircularProgress-sizeLarge': {
            width: '40px !important',
            height: '40px !important'
          }
        }
      }
    }
  },
  MuiGrid: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          '&.MuiGrid-container': {
            margin: '0 !important',
            padding: '0 1rem !important',
            width: '100% !important',
            flexDirection: 'column !important',
            '& .MuiGrid-item': {
              padding: '0 !important',
              marginBottom: '1rem !important',
              width: '100% !important',
              flexBasis: '100% !important',
              maxWidth: '100% !important',
              flex: '0 0 100% !important',
              minWidth: '100% !important'
            },
            '&.MuiGrid-spacing-xs-0 .MuiGrid-item': {
              marginBottom: '1rem !important'
            }
          },
          '&.MuiGrid-item': {
            padding: '0 !important',
            marginBottom: '1rem !important',
            width: '100% !important',
            flexBasis: '100% !important',
            maxWidth: '100% !important',
            flex: '0 0 100% !important',
            minWidth: '100% !important'
          },
          '&.MuiGrid-direction-xs-row': {
            flexDirection: 'column !important'
          },
          '&.MuiGrid-direction-xs-column': {
            flexDirection: 'column !important'
          },
          '&.MuiGrid-grid-xs-1, &.MuiGrid-grid-xs-2, &.MuiGrid-grid-xs-3, &.MuiGrid-grid-xs-4, &.MuiGrid-grid-xs-5, &.MuiGrid-grid-xs-6, &.MuiGrid-grid-xs-7, &.MuiGrid-grid-xs-8, &.MuiGrid-grid-xs-9, &.MuiGrid-grid-xs-10, &.MuiGrid-grid-xs-11, &.MuiGrid-grid-xs-12': {
            flexBasis: '100% !important',
            maxWidth: '100% !important',
            flex: '0 0 100% !important',
            minWidth: '100% !important'
          }
        }
      }
    }
  },
  MuiBox: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          '& .MuiPaper-root, & .MuiCard-root': {
            width: '100%',
            margin: '0 0 1rem 0'
          }
        }
      }
    }
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        '@media (max-width: 600px)': {
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: '0.125rem',
          '& .MuiToggleButton-root': {
            flex: '1 1 0%',
            minWidth: 'auto',
            minHeight: '40px',
            fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
            padding: '6px 4px'
          }
        }
      }
    }
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
        fontWeight: 600,
        textTransform: 'none',
        padding: '10px 16px',
        minHeight: '44px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(6, 182, 212, 0.12)',
          color: '#06b6d4',
          '&:hover': {
            backgroundColor: 'rgba(6, 182, 212, 0.16)'
          }
        },
        '@media (max-width: 600px)': {
          borderRadius: 6,
          fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
          padding: '6px 4px',
          minHeight: '40px',
          justifyContent: 'center',
          '& .MuiBox-root': {
            marginRight: '3px'
          }
        }
      },
      sizeSmall: {
        padding: '8px 12px',
        minHeight: '36px',
        fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
        '@media (max-width: 600px)': {
          padding: '10px 14px',
          minHeight: '44px',
          fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)'
        }
      }
    }
  },
};

// Breakpoints for mobile-first design
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Spacing system
const spacing = 8;

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
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f1f5f9' : '#0f172a',
        secondary: darkMode ? '#94a3b8' : '#475569',
      },
    },
    typography,
    components,
    breakpoints,
    spacing,
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
      '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
      '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
      '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      '0 25px 50px rgba(0, 0, 0, 0.25), 0 20px 20px rgba(0, 0, 0, 0.15)',
      '0 32px 64px rgba(0, 0, 0, 0.25), 0 24px 24px rgba(0, 0, 0, 0.15)',
      '0 40px 80px rgba(0, 0, 0, 0.25), 0 32px 32px rgba(0, 0, 0, 0.15)',
      '0 48px 96px rgba(0, 0, 0, 0.25), 0 40px 40px rgba(0, 0, 0, 0.15)',
      '0 56px 112px rgba(0, 0, 0, 0.25), 0 48px 48px rgba(0, 0, 0, 0.15)',
      '0 64px 128px rgba(0, 0, 0, 0.25), 0 56px 56px rgba(0, 0, 0, 0.15)',
      '0 72px 144px rgba(0, 0, 0, 0.25), 0 64px 64px rgba(0, 0, 0, 0.15)',
      '0 80px 160px rgba(0, 0, 0, 0.25), 0 72px 72px rgba(0, 0, 0, 0.15)',
      '0 88px 176px rgba(0, 0, 0, 0.25), 0 80px 80px rgba(0, 0, 0, 0.15)',
      '0 96px 192px rgba(0, 0, 0, 0.25), 0 88px 88px rgba(0, 0, 0, 0.15)',
      '0 104px 208px rgba(0, 0, 0, 0.25), 0 96px 96px rgba(0, 0, 0, 0.15)',
      '0 112px 224px rgba(0, 0, 0, 0.25), 0 104px 104px rgba(0, 0, 0, 0.15)',
      '0 120px 240px rgba(0, 0, 0, 0.25), 0 112px 112px rgba(0, 0, 0, 0.15)',
      '0 128px 256px rgba(0, 0, 0, 0.25), 0 120px 120px rgba(0, 0, 0, 0.15)',
      '0 136px 272px rgba(0, 0, 0, 0.25), 0 128px 128px rgba(0, 0, 0, 0.15)',
      '0 144px 288px rgba(0, 0, 0, 0.25), 0 136px 136px rgba(0, 0, 0, 0.15)',
      '0 152px 304px rgba(0, 0, 0, 0.25), 0 144px 144px rgba(0, 0, 0, 0.15)',
      '0 160px 320px rgba(0, 0, 0, 0.25), 0 152px 152px rgba(0, 0, 0, 0.15)',
      '0 168px 336px rgba(0, 0, 0, 0.25), 0 160px 160px rgba(0, 0, 0, 0.15)',
      '0 176px 352px rgba(0, 0, 0, 0.25), 0 168px 168px rgba(0, 0, 0, 0.15)',
      '0 184px 368px rgba(0, 0, 0, 0.25), 0 176px 176px rgba(0, 0, 0, 0.15)',
      '0 192px 384px rgba(0, 0, 0, 0.25), 0 184px 184px rgba(0, 0, 0, 0.15)',
    ],
  });
}
