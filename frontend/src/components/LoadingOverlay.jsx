import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Fade, 
  Backdrop,
  Paper
} from '@mui/material';
import { LoadingSpinner } from './LoadingSkeleton';

// Full screen loading overlay
export const FullScreenLoading = ({ 
  open, 
  message = 'Loading...', 
  size = 80 
}) => (
  <Backdrop
    sx={{ 
      color: '#fff', 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)'
    }}
    open={open}
  >
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 3
    }}>
      <CircularProgress 
        size={size} 
        thickness={4}
        sx={{ 
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      {message && (
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            textAlign: 'center',
            maxWidth: 300,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  </Backdrop>
);

// Inline loading overlay for content areas
export const InlineLoading = ({ 
  loading, 
  message = 'Loading...',
  height = '200px',
  showSpinner = true,
  children 
}) => {
  if (!loading) {
    return children;
  }

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Fade in={loading} timeout={300}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(2px)',
          borderRadius: 2,
          zIndex: 1
        }}>
          {showSpinner && (
            <CircularProgress 
              size={40} 
              thickness={3}
              sx={{ 
                color: 'primary.main',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
          )}
          {message && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Fade>
      {children}
    </Box>
  );
};

// Skeleton loading overlay
export const SkeletonLoading = ({ 
  loading, 
  skeleton: SkeletonComponent,
  children 
}) => {
  if (loading && SkeletonComponent) {
    return <SkeletonComponent />;
  }

  return children;
};

// Progress loading overlay
export const ProgressLoading = ({ 
  loading, 
  progress = 0,
  message = 'Loading...',
  height = '4px',
  children 
}) => {
  if (!loading) {
    return children;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Fade in={loading} timeout={300}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(2px)',
          borderRadius: 1
        }}>
          <Box sx={{ 
            width: '100%', 
            height: height,
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: height,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              transition: 'width 0.3s ease',
              borderRadius: height
            }} />
          </Box>
          {message && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 0.5,
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Fade>
      <Box sx={{ opacity: loading ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>
        {children}
      </Box>
    </Box>
  );
};

// Loading button wrapper
export const LoadingButton = ({ 
  loading, 
  loadingText = 'Loading...',
  children,
  disabled,
  ...buttonProps 
}) => {
  return React.cloneElement(children, {
    disabled: disabled || loading,
    startIcon: loading ? (
      <CircularProgress 
        size={16} 
        thickness={4}
        sx={{ color: 'inherit' }}
      />
    ) : children.props.startIcon,
    children: loading ? loadingText : children.props.children,
    ...buttonProps
  });
};

export default {
  FullScreenLoading,
  InlineLoading,
  SkeletonLoading,
  ProgressLoading,
  LoadingButton
};
