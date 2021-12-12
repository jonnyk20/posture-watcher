import blue from '@mui/material/colors/blue';
import green from '@mui/material/colors/green';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { ReactElement } from 'react';

type PropsType = {
  children: ReactElement;
};

const ThemeWrapper: React.FC<PropsType> = ({ children }) => {
  // const classes = useStyles();
  //   const { colorMode } = useUIContext();

  let theme = createTheme({
    palette: {
      primary: blue,
      success: {
        contrastText: '#fff',
        main: green[500],
      },
      mode: 'dark',
    },
    typography: {
      fontFamily: [
        'Roboto Condensed',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  theme = responsiveFontSizes(theme);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeWrapper;
