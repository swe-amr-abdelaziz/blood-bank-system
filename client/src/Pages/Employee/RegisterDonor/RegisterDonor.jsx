import {
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { getCities } from '../../../Redux/Slices/dataSlice';
import { registerDonor } from '../../../Redux/Slices/donorSlice';
// import { addJob } from '../../../Redux/Slices/jobSlice';

function RegisterDonor() {
  const cities = useSelector((state) => state.data.cities);

  const [errorVisible, setErrorVisible] = useState(false);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nationalId: { value: '', error: ' ', isInvalid: true },
    name: { value: '', error: ' ', isInvalid: true },
    city: { value: '', error: ' ', isInvalid: false },
    email: { value: '', error: ' ', isInvalid: true },
  });

  const handleRegisterDonor = async () => {
    setErrorVisible(true);

    const isValid = Object.values(form).filter((field) => field.isInvalid).length === 0;

    if (cities.filter((city) => city.id === form.city.value).length === 0) {
      toast.error('Please select a city from the menu');
    }

    if (isValid) {
      let data = { ...form };
      data = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key].value;
        return acc;
      }, {});

      dispatch(registerDonor(data))
        .then((response) => {
          if (response.payload.status === 'success') {
            toast.success(response.payload.message, { autoClose: 2500 });
          } else if (response.payload.errors) {
            const { errors } = response.payload;
            errors.forEach((error) => {
              toast.error(error.msg);
            });
          } else if (response.payload.status === 'error') {
            const { message } = response.payload;
            if (message.includes('duplicate') && message.includes('email')) {
              toast.error('Email already exists', { autoClose: 2500 });
            } else {
              toast.error(message);
            }
          } else if (response.payload.status === 'info') {
            const { message } = response.payload;
            toast.info(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getCities());
  }, []);

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleRegisterDonor();
    }
  };

  const handleGeneralChange = (key, value, pattern = /^.*$/, message = '') => {
    if (errorVisible) {
      if (!value) {
        setForm({
          ...form,
          [key]: {
            error: `${key[0].toUpperCase() + key.slice(1)} is required`,
            isInvalid: true,
            value,
          },
        });
      } else if (!pattern.test(value)) {
        setForm({
          ...form,
          [key]: {
            error: message,
            isInvalid: true,
            value,
          },
        });
      } else {
        setForm({
          ...form,
          [key]: {
            error: ' ',
            isInvalid: false,
            value,
          },
        });
      }
    } else {
      setForm({
        ...form,
        [key]: {
          error: ' ',
          isInvalid: false,
          value,
        },
      });
    }
  };

  const handleNationalIdChange = (event) => {
    handleGeneralChange('nationalId', event.target.value, /^(2|3)\d{13}$/, 'National Id must be 14 digits and starts with either 2 or 3');
  };

  const handleNameChange = (event) => {
    handleGeneralChange('name', event.target.value, /^[\u0621-\u064A\u0660-\u0669a-zA-Z\-_\s]{3,50}$/, 'Name is invalid, only English or Arabic letters are allowed');
  };

  const handleCityChange = (event) => {
    setForm({
      ...form,
      city: {
        ...form.city,
        value: event.target.value,
      },
    });
  };

  const handleEmailChange = (event) => {
    handleGeneralChange('email', event.target.value, /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is invalid, eg. example@xyz.com');
  };

  return (
    <>
      <Container
        maxWidth="lg"
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: 'calc(100vh)',
          padding: '50px',
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
            className="col-12 p-5"
            style={{ backgroundColor: '#fff' }}
          >
            <Container
              maxWidth="xs"
              className="d-flex flex-column justify-content-center align-items-center h-100"
            >
              <div className="row">
                <div className="col-12">
                  <Typography
                    variant="h1"
                    className="text-center my-3"
                  >
                    Register Donor
                  </Typography>
                </div>
              </div>
              <div className="row">

                <TextField
                  size="small"
                  error={form.nationalId.isInvalid && errorVisible}
                  id="input-national-id"
                  label="National ID"
                  value={form.nationalId.value}
                  onKeyUp={handleKeyUp}
                  onChange={handleNationalIdChange}
                  helperText={form.nationalId.error}
                  className="my-1"
                />

                <TextField
                  size="small"
                  error={form.name.isInvalid && errorVisible}
                  id="input-name"
                  label="Name"
                  value={form.name.value}
                  onKeyUp={handleKeyUp}
                  onChange={handleNameChange}
                  helperText={form.name.error}
                  className="my-1"
                />

                <InputLabel id="select-city-label">City</InputLabel>
                <Select
                  size="small"
                  labelId="select-city-label"
                  id="select-city"
                  value={form.city.value}
                  onChange={handleCityChange}
                  style={{ marginBottom: '20px', padding: 0 }}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>

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

                <div className="mb-3 p-0">
                  {loading ? (
                    <div className="col-12 text-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    <Button
                      onClick={handleRegisterDonor}
                      className="w-100"
                      variant="contained"
                      color="primary"
                    >
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </Container>
          </div>
        </div>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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

export default RegisterDonor;
