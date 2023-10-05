import  axios from "axios"


export function initialAxios() {
  axios.defaults.baseURL = "http://localhost:3000/api";
  axios.defaults.headers.common.Authorization = 'AUTH TOKEN';
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  axios.interceptors.request.use(request => {
      const token = "";
      if (token) {
          request.headers.Authorization = token
      }
      return request;
  }, error => {
      return Promise.reject(error);
  });

 /*  axios.interceptors.response.use(response => {
      // failed load response data
      if (response.data === "") {
          response.data = { "message": "failed to load response data" }
      }
      return response;
  }, error => {
      console.log(error);
      const { statusCode } = error.response.data;
      if (statusCode == '10003') {
        const event = new CustomEvent('invalidToken', { detail: true });
        window.dispatchEvent(event);
      }

      return Promise.reject(error);
  }); */

}
