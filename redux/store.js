import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import bookSlice from './slices/bookSlice'
import departmentSlice from './slices/departmentSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
  reducer: {
    book: bookSlice,
    department: departmentSlice,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export default store
