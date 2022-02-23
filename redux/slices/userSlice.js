import { createSlice } from '@reduxjs/toolkit'
import { API } from '../../API/API'
const initialState = {
  loading: false,
  user: {},
  error: null,
  userSettings: {},
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state) => {
      state.loading = true
      state.error = null
    },
    getUserSuccess: (state, { payload }) => {
      state.loading = false
      state.user = payload
    },
    getUserFailure: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
    getUserSettings: (state, { payload }) => {
      state.userSettings = payload
    },
  },
})

export default userSlice.reducer
export const { getUser, getUserSuccess, getUserFailure, getUserSettings } =
  userSlice.actions
export const userSelector = (state) => state.user

export function fetchUser(email) {
  return async (dispatch) => {
    try {
      dispatch(getUser())
      const { data } = await API.get('/user/getUserBy?email=' + email)
      localStorage.setItem(
        'userSettings',
        JSON.stringify(data.user.userSettings)
      )
      dispatch(getUserSettings(data.user.userSettings))
      dispatch(getUserSuccess(data.user))
    } catch (err) {
      dispatch(getUserFailure(err))
    }
  }
}
