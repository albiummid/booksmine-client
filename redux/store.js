import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import bookReducer from './slices/bookSlice'
import departmentReducer from './slices/departmentSlice'

const store = configureStore({
  reducer: {
    book: bookReducer,
    department: departmentReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export default store
