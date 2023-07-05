/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, axiosInstanceFormData } from '../../Axios';

const URL = '/api/v1';

const hasToken = localStorage.getItem('token') !== null;
const role = localStorage.getItem('role') || '';
const initialState = {
  isLoggedIn: hasToken,
  role,
  loading: false,
};

export const userLogin = createAsyncThunk('auth/userLogin', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${URL}/auth/${data.user}/login`, {
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const employeeRegister = createAsyncThunk('auth/employeeRegister', async (data, thunkAPI) => {
  try {
    const response = await axiosInstanceFormData.post(`${URL}/employees`, data);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const employerRegister = createAsyncThunk('auth/employerRegister', async (data, thunkAPI) => {
  try {
    const response = await axiosInstanceFormData.post(`${URL}/employers`, data);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.isLoggedIn = false;
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state) => {
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.loading = false;
      });
  },
});

export const { setIsLoggedIn, setRole } = authSlice.actions;
export default authSlice.reducer;
