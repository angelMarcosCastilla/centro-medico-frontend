import axios from 'axios'
import { getToken } from '../utils/auth'
import { BASE_URL_WS } from '../config'

export function initialAxios() {
  axios.defaults.baseURL = `${BASE_URL_WS}/api`
  axios.defaults.headers.common.Authorization = "AUTH_TOKEN"
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  // en cada petición mandamos el token
  axios.interceptors.request.use(
    (request) => {
      const token = getToken()
      if (token) {
        request.headers.Authorization = `Bearer ${token}`
      }
      return request
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  axios.interceptors.response.use(response => {
      return response;
  }, error => {
      const { status } = error.response;
      if (status === 401) {
        const event = new CustomEvent('invalidToken', { detail: true });
        window.dispatchEvent(event);
      }

     /*  return Promise.reject(error); */
  }); 
}
