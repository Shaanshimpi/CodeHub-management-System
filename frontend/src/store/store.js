import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'
import authReducer from './slices/authSlice'
import studentReducer from './slices/studentSlice'
import courseReducer from './slices/courseSlice'
import attendanceReducer from './slices/attendanceSlice'
import feeReducer from './slices/feeSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    students: studentReducer,
    courses: courseReducer,
    attendance: attendanceReducer,
    fees: feeReducer,
    users: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

export default store