import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import dataReducer from './Slices/dataSlice';
import donationReducer from './Slices/donationSlice';
import donorReducer from './Slices/donorSlice';
import profileReducer from './Slices/profileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    donation: donationReducer,
    donor: donorReducer,
    profile: profileReducer,
  },
});

export default store;
