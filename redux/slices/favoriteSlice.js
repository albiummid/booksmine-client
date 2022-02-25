import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  favorites: [],
  loading: false,
  error: null,
}

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    addToFavorite: (state) => {
      state.loading = true
    },
    addToFavoriteSuccess: (state, { payload }) => {
      state.loading = false
      //   state.favorites = payload // for prod
      state.favorites.push(payload)
      toast.success(`The book added to favorite !`)
    },
    addToFavoriteFailure: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
    removeFromFavorite: (state) => {
      state.loading = true
    },
    removeFromFavoriteSuccess: (state, { payload }) => {
      state.loading = false
      //   state.favorites = payload //for prod
      const newFavorites = state.favorites.filter((item) => item !== payload)
      state.favorites = newFavorites
      toast.info('Removed the book from favorite !')
    },
    removeFromFavoriteFailure: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
  },
})

export default favoriteSlice.reducer

export const {
  addToFavorite,
  addToFavoriteSuccess,
  addToFavoriteFailure,
  removeFromFavorite,
  removeFromFavoriteSuccess,
  removeFromFavoriteFailure,
} = favoriteSlice.actions

export const favoriteSelector = (state) => state.favorite

export const doFavorite = (id) => {
  return async (dispatch) => {
    dispatch(addToFavorite())
    // const favArray = [].push( id ); //for prod
    //fetching data from db and get updated Array;
    // set the array to state.. but for now we just pass the id for adding on state...

    dispatch(addToFavoriteSuccess(id))
  }
}

export const undoFavorite = (id) => {
  return async (dispatch) => {
    dispatch(removeFromFavorite())

    dispatch(removeFromFavoriteSuccess(id))
  }
}
