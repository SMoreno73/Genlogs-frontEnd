import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
    },
    secondary: {
      main: '#f97316',
    },
    background: {
      default: '#f5efe4',
      paper: 'rgba(255, 250, 242, 0.92)',
    },
    text: {
      primary: '#1f2937',
      secondary: '#52606d',
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(18px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

export default theme;
