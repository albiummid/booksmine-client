import axios from 'axios'

let API

if (typeof window !== 'undefined') {
  let localURL = JSON.parse(window.localStorage.getItem('userSettings'))?.base

  let baseURL = localURL || 'https://booksmine-server.herokuapp.com/api/v1/'
  console.log('currentBase: ', baseURL)
  // const baseURL = 'http://localhost:8080/api/v1'

  API = axios.create({
    baseURL,
  })
}

export default API
