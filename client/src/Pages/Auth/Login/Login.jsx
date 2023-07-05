import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import loginImage from '../../../assets/login.jpg';
import SecondaryNavbar from '../../../Components/Shared/SecondaryNavbar/SecondaryNavbar';
import { setIsLoggedIn, setRole, userLogin } from '../../../Redux/Slices/authSlice';
import { setImage } from '../../../Redux/Slices/profileSlice';

function Login() {
  const [tab, setTab] = useState('employee');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const [errorVisible, setErrorVisible] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: {
      value: '',
      error: ' ',
      isInvalid: true,
    },
    password: {
      value: '',
      error: ' ',
      isInvalid: true,
    },
  });

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogin = async () => {
    setErrorVisible(true);
    const isValid = Object.values(form).filter((field) => field.isInvalid).length === 0;
    if (isValid) {
      dispatch(userLogin({
        user: tab,
        email: form.email.value,
        password: form.password.value,
      }))
        .then((response) => {
          if (response.payload.message === 'Authenticated') {
            localStorage.setItem('token', response.payload.token);
            localStorage.setItem('image', response.payload.image);
            localStorage.setItem('role', response.payload.role);
            dispatch(setIsLoggedIn(true));
            dispatch(setImage(response.payload.image));
            dispatch(setRole(response.payload.role));
            navigate('/');
          } else {
            toast.error(response.payload.message);
          }
        });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, []);

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleEmailChange = (event) => {
    const pattren = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const { value } = event.target;
    if (errorVisible) {
      if (!value) {
        setForm({
          ...form,
          email: {
            error: 'Email is required',
            isInvalid: true,
            value,
          },
        });
      } else if (!pattren.test(value)) {
        setForm({
          ...form,
          email: {
            error: 'Email is invalid, eg. example@xyz.com',
            isInvalid: true,
            value,
          },
        });
      } else {
        setForm({
          ...form,
          email: {
            error: ' ',
            isInvalid: false,
            value,
          },
        });
      }
    } else {
      setForm({
        ...form,
        email: {
          error: ' ',
          isInvalid: false,
          value,
        },
      });
    }
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    if (errorVisible) {
      if (!value) {
        setForm({
          ...form,
          password: {
            error: 'Password is required',
            isInvalid: true,
            value,
          },
        });
      } else if (value.length < 8) {
        setForm({
          ...form,
          password: {
            error: 'Password must be at least 8 characters',
            isInvalid: true,
            value,
          },
        });
      } else {
        setForm({
          ...form,
          password: {
            error: ' ',
            isInvalid: false,
            value,
          },
        });
      }
    } else {
      setForm({
        ...form,
        password: {
          error: ' ',
          isInvalid: false,
          value,
        },
      });
    }
  };

  return (
    <>
      <SecondaryNavbar />
      <Container
        maxWidth="lg"
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        <div
          className="row"
          style={{
            boxShadow:
            '0px 0px 10px -1px rgba(0,0,0,0.12),0px 0px 20px 0px rgba(0,0,0,0.09),0px 0px 30px 0px rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="col-12 col-lg-6 p-5"
            style={{ backgroundColor: '#fff' }}
          >
            <Container
              maxWidth="xs"
              className="d-flex flex-column justify-content-center align-items-center h-100"
            >
              <Tabs
                value={tab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab value="employee" label="employee" />
                <Tab value="hospital" label="hospital" />
              </Tabs>
              <div className="row">
                <div className="col-12">
                  <Typography
                    variant="h1"
                    className="text-center my-3"
                  >
                    Login as
                    {tab === 'employee' ? ' an' : ' a'}
                    &nbsp;
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </Typography>
                </div>
              </div>
              <div className="row">
                <TextField
                  size="small"
                  error={form.email.isInvalid && errorVisible}
                  id="input-email"
                  label="Email"
                  value={form.email.value}
                  onKeyUp={handleKeyUp}
                  onChange={handleEmailChange}
                  helperText={form.email.error}
                  className="my-1"
                />
                <TextField
                  type="password"
                  size="small"
                  error={form.password.isInvalid && errorVisible}
                  id="input-password"
                  label="Password"
                  value={form.password.value}
                  onKeyUp={handleKeyUp}
                  onChange={handlePasswordChange}
                  helperText={form.password.error}
                  className="my-1"
                />
                <div className="mb-3 p-0">
                  <Typography variant="p">
                    Don&apos;t have an account?&nbsp;
                    <Link to="/register">
                      <Typography variant="span" color="primary">
                        Sign up
                      </Typography>
                    </Link>
                  </Typography>
                </div>
                <div className="mb-3 p-0">
                  {loading ? (
                    <div className="col-12 text-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    <Button
                      onClick={handleLogin}
                      className="w-100"
                      variant="contained"
                      color="primary"
                      style={{ padding: '10px' }}
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </div>
            </Container>
          </div>
          <div className="col-12 col-lg-6 p-5 d-none d-lg-block">
            <img
              src={loginImage}
              alt="software developer"
              style={{ maxWidth: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Login;
