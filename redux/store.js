import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import bookSlice from './slices/bookSlice'
import departmentSlice from './slices/departmentSlice'

const store = configureStore({
  reducer: {
    book: bookSlice,
    department: departmentSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export default store
