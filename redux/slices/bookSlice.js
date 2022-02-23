import { createSlice } from '@reduxjs/toolkit'
import { API } from '../../API/API'
const initialState = {
  loading: false,
  books: [],
  error: null,
}
const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    getBooks: (state) => {
      state.loading = true
    },
    getBooksSuccess: (state, { payload }) => {
      state.books = payload
      state.loading = false
      state.error = null
    },
    getBooksFailure: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
  },
})

// Exporting Reducer =>
export default bookSlice.reducer

// Exporting actions =>
export const { getBooks, getBooksSuccess, getBooksFailure } = bookSlice.actions

// Exporting Book_Selector =>
export const bookSelector = (state) => state.book

// Thunk Async function
export function fetchBooks() {
  return async (dispatch) => {
    dispatch(getBooks())
    try {
      const { data } = await API.get('/book/all')
      dispatch(getBooksSuccess(data.books))
    } catch (err) {
      dispatch(getBooksFailure(err))
    }
  }
}
