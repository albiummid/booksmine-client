import { createSlice } from '@reduxjs/toolkit'
import { API } from '../../API/API'
const initialState = {
  loading: false,
  departments: [],
  error: null,
}
const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    getDepartments: (state) => {
      state.loading = true
    },
    getDepartmentsSuccess: (state, { payload }) => {
      state.departments = payload
      state.loading = false
      state.error = null
    },
    getDepartmentsFailure: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
  },
})

// Exporting Reducer =>
export default departmentSlice.reducer

// Exporting actions =>
export const { getDepartments, getDepartmentsSuccess, getDepartmentsFailure } =
  departmentSlice.actions

// Exporting Book_Selector =>
export const departmentSelector = (state) => state.department

// Thunk Async function
export function fetchDepartments() {
  return async (dispatch) => {
    dispatch(getDepartments())
    try {
      const { data } = await API.get('/department/all')
      dispatch(getDepartmentsSuccess(data.departments))
    } catch (err) {
      dispatch(getDepartmentsFailure(err))
    }
  }
}
