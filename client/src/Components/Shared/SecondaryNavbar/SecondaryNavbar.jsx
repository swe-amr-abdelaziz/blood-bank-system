import {
  Container,
  AppBar,
  Box,
  Toolbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';

function SecondaryNavbar() {
  return (
    <AppBar
      position="sticky"
      color="common"
      style={{
        boxShadow:
          '0px 0px 0px -1px rgba(0,0,0,0.0)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Link className="navbar-brand" to="/">
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'flex' },
              }}
            >
              <img src={logo} alt="Employment Platform" width={32} />
            </Box>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default SecondaryNavbar;
