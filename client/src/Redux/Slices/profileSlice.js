/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../Axios';

// const URL = '/api/v1/';

const initialState = {
  user: {},
  image: localStorage.getItem('image'),
  // favoriteVendors: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
    },
  },
});

export const { setImage } = profileSlice.actions;
export default profileSlice.reducer;
