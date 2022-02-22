import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import bookReducer from './slices/bookSlice'

const store = configureStore({
  reducer: {
    book: bookReducer,
  },
  middleware: [thunk],
})

export default store
