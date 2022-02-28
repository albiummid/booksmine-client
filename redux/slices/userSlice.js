import { createSlice } from '@reduxjs/toolkit'
import API from '../../API/API'

const initialState = {
  loading: false,
  user: {},
  error: null,
  userSettings: {},
  orders: [],
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
    getOrders: (state) => {
      state.loading = true
    },
    getOrdersSuccess: (state, { payload }) => {
      state.loading = false
      state.orders = payload
      state.error = null
    },
    getOrdersFailure: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
  },
})

export default userSlice.reducer
export const {
  getUser,
  getUserSuccess,
  getUserFailure,
  getUserSettings,
  getOrders,
  getOrdersSuccess,
  getOrdersFailure,
} = userSlice.actions
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

export function fetchOrders(email) {
  return async (dispatch) => {
    dispatch(getOrders())
    try {
      const { data } = await API.get('/order/getOrdersBy?email=' + email)
      try {
        dispatch(getOrdersSuccess(data.orders))
      } catch (err) {
        console.log(err, 'err of dispatch')
      }
      console.log(data)
    } catch (err) {
      dispatch(getOrdersFailure(err))
      console.log(err)
    }
  }
}
