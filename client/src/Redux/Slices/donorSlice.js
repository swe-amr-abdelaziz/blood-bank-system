import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Axios';

const URL = '/api/v1/donors';

const initialState = {};

export const registerDonor = createAsyncThunk('donor/registerDonor', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${URL}/register`, data);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const donorSlice = createSlice({
  name: 'donor',
  initialState,
  reducers: {},
});

export default donorSlice.reducer;
