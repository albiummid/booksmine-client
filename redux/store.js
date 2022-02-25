import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import bookReducer from './slices/bookSlice'
import cartReducer from './slices/cartSlice'
import departmentReducer from './slices/departmentSlice'
import favoriteReducer from './slices/favoriteSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
  reducer: {
    book: bookReducer,
    department: departmentReducer,
    user: userReducer,
    cart: cartReducer,
    favorite: favoriteReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export default store
