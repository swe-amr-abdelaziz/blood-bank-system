/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Axios';

const URL = '/api/v1/donations';

const initialState = {
  donations: [],
  donation: {},
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  queryString: '',
  rejectionReason: '',
  bloodGroup: '',
  bloodLifetime: '',
  visibleAccept: false,
  visibleReject: false,
};

export const getPendingDonations = createAsyncThunk('donations/getPendingDonations', async (queryString, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${URL}/pending?${queryString}`);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const acceptDonation = createAsyncThunk('donations/acceptDonation', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`${URL}/accept/${data.id}`, data);
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const rejectDonation = createAsyncThunk('donations/rejectDonation', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`${URL}/reject/${data.id}`, { rejectionReason: data.rejectionReason });
    return response.data;
  } catch (error) {
    if (error.response.data.message === 'UnAuthorized..!') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    setDonation: (state, action) => {
      state.donation = action.payload;
    },
    setRejectionReason: (state, action) => {
      state.rejectionReason = action.payload;
    },
    setBloodGroup: (state, action) => {
      state.bloodGroup = action.payload;
    },
    setBloodLifetime: (state, action) => {
      state.bloodLifetime = action.payload;
    },
    removeDonation: (state) => {
      state.donation = {};
    },
    setVisibleAccept: (state, action) => {
      state.visibleAccept = action.payload;
    },
    setVisibleReject: (state, action) => {
      state.visibleReject = action.payload;
    },
    setQueryString: (state, action) => {
      state.queryString = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPendingDonations.fulfilled, (state, action) => {
        const { results } = action.payload;
        state.donations = results.donations;
        state.pagination = {
          ...state.pagination,
          page: results.page,
          totalPages: results.totalPages,
        };
      });
  },
});

export const {
  setDonation,
  setRejectionReason,
  setBloodGroup,
  setBloodLifetime,
  removeDonation,
  setVisibleAccept,
  setVisibleReject,
  setQueryString,
  setPagination,
} = donationSlice.actions;
export default donationSlice.reducer;
