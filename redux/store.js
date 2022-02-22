import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import bookReducer from './slices/bookSlice'

const store = configureStore({
  reducer: {
    book: bookReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export default store
