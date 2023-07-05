import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../assets/logo.png';
import { setIsLoggedIn, setRole } from '../../../Redux/Slices/authSlice';

const {
  VITE_ROLE_ADMIN,
  VITE_ROLE_EMPLOYEE,
  VITE_ROLE_HOSPITAL,
} = import.meta.env;

const pages = [
  { name: 'register donor', path: '/register/donor', role: VITE_ROLE_EMPLOYEE },
  { name: 'pending donations', path: '/donations', role: VITE_ROLE_EMPLOYEE },
  { name: 'request blood', path: '/', role: VITE_ROLE_HOSPITAL },
  { name: 'manage employees', path: '/', role: VITE_ROLE_HOSPITAL },
  { name: 'statistics', path: '/', role: VITE_ROLE_ADMIN },
  { name: 'manage hospitals', path: '/', role: VITE_ROLE_ADMIN },
];

const settings = [
  { name: 'Profile', path: '/profile', isLoggedIn: true },
  { name: 'Logout', path: '/logout', isLoggedIn: true },
  { name: 'Log in', path: '/login', isLoggedIn: false },
  { name: 'Sign up', path: '/register', isLoggedIn: false },
];

function Navbar() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const image = useSelector((state) => state.profile.image);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
    dispatch(setRole('guest'));
    localStorage.clear();
    handleCloseUserMenu();
    navigate('/');
  };

  const renderPagesWeb = pages.map((page) => {
    if (page.role === role) {
      return (
        <Link key={`menu-${page.name}`} to={page.path}>
          <MenuItem onClick={handleCloseNavMenu}>
            <Typography textAlign="center" color="black">{page.name}</Typography>
          </MenuItem>
        </Link>
      );
    }
    return null;
  });

  const renderPagesMobile = pages.map((page) => {
    if (page.role === role) {
      return (
        <Link key={`btn-${page.name}`} to={page.path}>
          <Button
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'black', display: 'block' }}
          >
            {page.name}
          </Button>
        </Link>
      );
    }
    return null;
  });

  const renderSettings = settings.map((setting) => {
    if (setting.name === 'Logout' && isLoggedIn) {
      return (
        <MenuItem key={setting.name} onClick={handleLogout}>
          <Typography textAlign="center" color="black">{setting.name}</Typography>
        </MenuItem>
      );
    } if (setting.isLoggedIn === isLoggedIn) {
      return (
        <Link key={setting.name} to={setting.path}>
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center" color="black">{setting.name}</Typography>
          </MenuItem>
        </Link>
      );
    }
    return null;
  });

  return (
    <AppBar
      position="sticky"
      color="common"
      style={{
        boxShadow:
          '0px 2px 4px -1px rgba(0,0,0,0.06),0px 4px 5px 0px rgba(0,0,0,0.045),0px 1px 10px 0px rgba(0,0,0,0.03)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters style={{ height: 72 }}>
          <Link className="navbar-brand" to="/">
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <img src={logo} alt="Employment Platform" width={32} />
            </Box>
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <img src={logo} alt="Where to go" width={32} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {renderPagesWeb}
            </Menu>
          </Box>
          <Box
            className="ms-4"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {renderPagesMobile}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {isLoggedIn ? (
                  <Avatar
                    alt="Profile Image"
                    src={`http://localhost:8080/api/v1/file/image/${role === VITE_ROLE_HOSPITAL ? 'hospital' : 'employee'}/${image}`}
                  />
                ) : (
                  <AccountCircleIcon color="primary" style={{ fontSize: 40 }} />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {renderSettings}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
