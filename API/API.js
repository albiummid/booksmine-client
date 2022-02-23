import axios from 'axios'

const baseURL = 'https://booksmine-server.herokuapp.com/api/v1/'
// const baseURL = 'http://localhost:8080/api/v1'

export const API = axios.create({
  baseURL,
})
