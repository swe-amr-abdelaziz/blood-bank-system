import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import { ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes';

const getTheme = createTheme({
  palette: {
    primary: {
      main: '#ED1B24',
      dark: '#A91525',
      light: '#ff5f5f',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
    fontWeightRegular: 400,
    h1: {
      fontFamily: 'archivo, sans-serif',
      fontWeight: 700,
      fontSize: 32,
      padding: '20px 0',
    },
    h2: {
      fontFamily: 'archivo, sans-serif',
      fontWeight: 700,
      fontSize: 28,
      padding: '16px 0',
    },
    h3: {
      fontFamily: 'archivo, sans-serif',
      fontWeight: 700,
      fontSize: 24,
      padding: '12px 0',
    },
    h4: {
      fontFamily: 'archivo, sans-serif',
      fontWeight: 700,
      fontSize: 20,
      padding: '10px 0',
    },
    h5: {
      fontFamily: 'archivo, sans-serif',
      fontWeight: 700,
      fontSize: 18,
    },
    h6: {
      fontFamily: 'archivo, sans-serif',
      fontWeight: 700,
      fontSize: 16,
    },
    body: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 400,
      fontSize: 16,
    },
  },
  shape: {
    borderRadius: 4,
  },
});

function App() {
  const theme = getTheme;

  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href="../src/assets/favicon.ico"
        />
      </Helmet>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </>
  );
}

export default App;
