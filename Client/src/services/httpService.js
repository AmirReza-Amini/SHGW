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
     toast.error("خطا در برقراری ارتباط با سرور. لطفا با ادمین سایت تماس بگیرید");
    //toastr.error('Server Error','An Unexpected error occured!')
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
