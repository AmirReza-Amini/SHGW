import axios from "axios";
import { toast } from 'react-toastify';

axios.interceptors.response.use(res => {
  //console.log('interceptor response', res.data.token);
  if (res.status === 200 && res.data.token) {
    //console.log('new token', res.data.token)
    localStorage.setItem('token', res.data.token)
  }

  return Promise.resolve(res);
})

axios.interceptors.request.use(req => {
  //console.log('set http jewt', localStorage.getItem('token'))
  req.headers.common['x-auth-token'] = localStorage.getItem('token');
  return req
})

axios.interceptors.response.use(null, error => {
  // console.log('from http service', error.response)
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  //console.log("error", error);
  if (!expectedError) {
    // status code 500
    toast.error("Error in connecting to the server, Call to the Administrator");
    console.log(error.response, error); // eeno bayad log begirim
    //toastr.error('Server Error','An Unexpected error occured!')
  }

  if (expectedError) {
    console.log(error.response);
    const message = error.response.data.data && error.response.data.data.length > 0 ? error.response.data.data[0] : null;
    switch (error.response.status) {

      case 400:
        message !== null ? toast.error(message) : toast.error("Input data is not valid");
        break;
      case 401:
        message !== null ? toast.error(message) : toast.error("User not found");
        break;
      case 403:
        message !== null ? toast.error(message) : toast.error("Access to this section is forbidden");
        break;
      case 404:
        message !== null ? toast.error(message) : toast.error("The required services has not been found");
        break;
    }
  }

  return Promise.reject(error);
});

export function setJwt(jwt) {
  //console.log('set http jewt',jwt)
  //axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt: setJwt
};
