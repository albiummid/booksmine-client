import axios from 'axios'

export const localAPI = 'http://localhost:8080/api/v1'
export const serverAPI = 'https://booksmine-server.herokuapp.com/api/v1'

let API

if (typeof window !== 'undefined') {
  let localURL = JSON.parse(window.localStorage.getItem('userSettings'))?.base

  let baseURL = localURL || 'https://booksmine-server.herokuapp.com/api/v1'
  console.log('currentBase: ', baseURL)

  API = axios.create({
    baseURL,
  })
}

export default API
