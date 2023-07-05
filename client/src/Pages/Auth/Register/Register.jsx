import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import SecondaryNavbar from '../../../Components/Shared/SecondaryNavbar/SecondaryNavbar';
import { employeeRegister, employerRegister } from '../../../Redux/Slices/authSlice';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Register() {
  const [tab, setTab] = useState('employee');
  const [imageUrl, setImageUrl] = useState(null);
  const progLangs = [];
  // const vacancies = useSelector((state) => state.data.vacancies);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const [errorVisible, setErrorVisible] = useState(false);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: { value: '', error: ' ', isInvalid: true },
    email: { value: '', error: ' ', isInvalid: true },
    password: { value: '', error: ' ', isInvalid: true },
    nationalId: { value: '', error: ' ', isInvalid: true },
    city: { value: '', error: ' ', isInvalid: true },
    biography: { value: '', error: ' ', isInvalid: true },
    experience: { value: 'Junior', error: ' ', isInvalid: false },
    image: { value: '', error: ' ', isInvalid: false },
    progLangs: { value: [], error: ' ', isInvalid: true },
    vacancy: { value: '', error: ' ', isInvalid: false },
  });

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleRegister = async () => {
    setErrorVisible(true);

    if (tab === 'employee') {
      const { vacancy, ...filteredInputs } = form;
      const isValid = Object.values(filteredInputs).filter((field) => field.isInvalid).length === 0;
      if (form.progLangs.value.length === 0) {
        toast.error('Please select at least one programming language');
      }
      if (isValid) {
        let data = { ...form };
        data.progLangs = {
          ...data.progLangs,
          value: data.progLangs.value.map((language) => language.id),
        };
        data = Object.keys(data).reduce((acc, key) => {
          acc[key] = data[key].value;
          return acc;
        }, {});
        dispatch(employeeRegister(data))
          .then((response) => {
            if (response.error) {
              const { errors } = response.payload;
              errors?.forEach((error) => {
                toast.error(error.msg);
              });
            } else if (response.payload.status === 'success') {
              toast.success(response.payload.message, {
                onClose: () => navigate('/login'),
                autoClose: 2500,
              });
            }
          });
      }
    } else {
      const filteredInputs = {
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.image,
        vacancy: form.vacancy,
      };
      const isValid = Object.values(filteredInputs).filter((field) => field.isInvalid).length === 0;
      if (isValid) {
        const data = Object.keys(filteredInputs).reduce((acc, key) => {
          acc[key] = filteredInputs[key].value;
          return acc;
        }, {});
        dispatch(employerRegister(data))
          .then((response) => {
            if (response.error) {
              const { errors } = response.payload;
              errors.forEach((error) => {
                toast.error(error.msg);
              });
            } else if (response.payload.status === 'success') {
              toast.success(response.payload.message, {
                onClose: () => navigate('/login'),
                autoClose: 2500,
              });
            }
          });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
      // return;
    }
    // dispatch(getProgLangs());
    // dispatch(getVacancies())
    // .then((response) => {
    //   setForm({
    //     ...form,
    //     vacancy: {
    //       ...form.vacancy,
    //       value: response.payload.results[0].id,
    //     },
    //   });
    // });
  }, []);

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
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

  const handleNameChange = (event) => {
    handleGeneralChange('name', event.target.value, /^[a-zA-Z.-]+( [a-zA-Z.-]+)+$/, 'Name is invalid, eg. John Doe');
  };

  const handleEmailChange = (event) => {
    handleGeneralChange('email', event.target.value, /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is invalid, eg. example@xyz.com');
  };

  const handlePasswordChange = (event) => {
    handleGeneralChange('password', event.target.value, /^\S{8,}$/, 'Password must be at least 8 characters');
  };

  const handleNationalIdChange = (event) => {
    handleGeneralChange('nationalId', event.target.value, /^\d{14}$/, 'National Id is invalid, must be 14 digits');
  };

  const handleCityChange = (event) => {
    handleGeneralChange('city', event.target.value);
  };

  const handleBiographyChange = (event) => {
    handleGeneralChange('biography', event.target.value, /^.{60,}$/, 'Biography must be at least 60 characters');
  };

  const handleVacancyChange = (event) => {
    setForm({
      ...form,
      vacancy: {
        ...form.vacancy,
        value: event.target.value,
      },
    });
  };

  const handleProgLangsChange = (event) => {
    const { value } = event.target;
    if (value.length === 0) {
      setForm({
        ...form,
        progLangs: {
          ...form.progLangs,
          isInvalid: true,
        },
      });
    } else if (value.length > 5) {
      setForm({
        ...form,
        progLangs: {
          ...form.progLangs,
          isInvalid: true,
        },
      });
      toast.error('Max 5 languages allowed');
    } else {
      setForm({
        ...form,
        progLangs: {
          ...form.progLangs,
          value: event.target.value,
          isInvalid: false,
        },
      });
    }
  };

  const handleExperienceChange = (event) => {
    setForm({
      ...form,
      experience: {
        error: ' ',
        isInvalid: false,
        value: event.target.value,
      },
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setForm({
      ...form,
      image: { value: file, error: ' ', isInvalid: false },
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <SecondaryNavbar />
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
              <Tabs
                value={tab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="primary tabs example"
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
                    Register as
                    {tab === 'employee' ? ' an' : ' a'}
                    &nbsp;
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </Typography>
                </div>
              </div>
              <div className="row">

                <TextField
                  size="small"
                  error={form.name.isInvalid && errorVisible}
                  id="input-name"
                  label="Name"
                  value={form.name.value}
                  onKeyUp={handleKeyUp}
                  onChange={handleNameChange}
                  helperText={form.name.error}
                />

                <TextField
                  size="small"
                  error={form.email.isInvalid && errorVisible}
                  id="input-email"
                  label="Email"
                  value={form.email.value}
                  onKeyUp={handleKeyUp}
                  onChange={handleEmailChange}
                  helperText={form.email.error}
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
                />
                {tab === 'employer' && (
                  <>
                    <InputLabel id="select-vacancy-label">Vacancy</InputLabel>
                    <Select
                      size="small"
                      labelId="select-vacancy-label"
                      id="select-vacancy"
                      value={form.vacancy.value}
                      onChange={handleVacancyChange}
                      style={{ marginBottom: '30px', marginTop: '5px', padding: 0 }}
                    >
                      {/* {vacancies.map((vacancy) => (
                        <MenuItem key={vacancy.id} value={vacancy.id}>
                          <span>
                            <img src={`http://localhost:8080/api/v1/images/${vacancy.image}`} style={{ height: '50px', borderRadius: '50%', marginRight: '10px' }} alt={vacancy.name} />
                            {vacancy.name}
                          </span>
                        </MenuItem>
                      ))} */}
                    </Select>
                  </>
                )}
                {tab === 'employee' && (
                  <>
                    <TextField
                      size="small"
                      error={form.nationalId.isInvalid && errorVisible}
                      id="input-nationalId"
                      label="National Id"
                      value={form.nationalId.value}
                      onKeyUp={handleKeyUp}
                      onChange={handleNationalIdChange}
                      helperText={form.nationalId.error}
                    />

                    <TextField
                      size="small"
                      error={form.city.isInvalid && errorVisible}
                      id="input-city"
                      label="City"
                      value={form.city.value}
                      onKeyUp={handleKeyUp}
                      onChange={handleCityChange}
                      helperText={form.city.error}
                    />

                    <InputLabel id="select-programming-languages-label">Programming Languages</InputLabel>
                    <Select
                      size="small"
                      labelId="select-programming-languages-label"
                      id="select-programming-languages"
                      multiple
                      value={form.progLangs.value}
                      onChange={handleProgLangsChange}
                      style={{ marginBottom: '20px', marginTop: '5px', padding: 0 }}
                      input={<OutlinedInput id="select-multiple-chip" label="" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value.id} label={value.language} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {progLangs.map((language) => (
                        <MenuItem
                          key={language.id}
                          value={language}
                        >
                          {language.language}
                        </MenuItem>
                      ))}
                    </Select>

                    <InputLabel id="select-experience-label">Experience</InputLabel>
                    <Select
                      size="small"
                      labelId="select-experience-label"
                      id="select-experience"
                      value={form.experience.value}
                      onChange={handleExperienceChange}
                      style={{ marginBottom: '30px', marginTop: '5px', padding: 0 }}
                    >
                      <MenuItem value="Junior">Junior</MenuItem>
                      <MenuItem value="Mid">Mid</MenuItem>
                      <MenuItem value="Senior">Senior</MenuItem>
                    </Select>

                    <TextField
                      size="small"
                      error={form.biography.isInvalid && errorVisible}
                      id="input-biography"
                      label="Biography"
                      value={form.biography.value}
                      onChange={handleBiographyChange}
                      helperText={form.biography.error}
                      multiline
                      rows={4}
                    />
                  </>
                )}

                <label htmlFor="upload-image" className="d-flex justify-content-center mb-3">
                  <Button variant="contained" component="span">
                    Upload Profile Image
                  </Button>
                  <input
                    id="upload-image"
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileUpload}
                  />
                </label>
                {imageUrl && <img src={imageUrl} alt="Upload" className="mb-4 w-50 mx-auto" />}

                <div className="mb-3 p-0">
                  <Typography variant="p">
                    Already have an account?&nbsp;
                    <Link to="/login">
                      <Typography variant="span" color="primary">
                        Sign in
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
                      onClick={handleRegister}
                      className="w-100"
                      variant="contained"
                      color="primary"
                    >
                      Sign up
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

export default Register;
