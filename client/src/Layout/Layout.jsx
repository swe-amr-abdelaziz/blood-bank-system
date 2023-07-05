import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from '../Components/Shared/Navbar/Navbar';

function Layout() {
  return (
    <>
      <Navbar />
      <Container style={{ padding: '20px' }}>
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
