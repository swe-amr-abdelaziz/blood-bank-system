/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Axios';

const URL = '/api/v1';

const initialState = {
  cities: [],
};

export const getCities = createAsyncThunk('data/getCities', async (thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${URL}/cities`);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCities.fulfilled, (state, action) => {
        const { results } = action.payload;
        state.cities = results;
      });
  },
});

export default dataSlice.reducer;
