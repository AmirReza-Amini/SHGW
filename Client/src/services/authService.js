import http from "./httpService";
import { apiUrl, tokenHashKey } from "../config.json";
import jwtDecode from "jwt-decode";
import * as CryptoJS from "crypto-js";
import { date } from "yup";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

//http.setJwt(getJwt());

toast.configure({ bodyClassName: "rtl" });

export async function login(user) {
  const { data } = await http.post(apiEndpoint, user);
  //console.log("from authserv", data)
  const jwt = data.data[0].token;
  localStorage.setItem(tokenKey, jwt);

}

// export function loginWithJwt(jwt) {
//   localStorage.setItem(tokenKey, jwt);
// }

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    const jwt = CryptoJS.AES.decrypt(
      localStorage.getItem("token"),
      tokenHashKey
    ).toString(CryptoJS.enc.Utf8);
    const decToken = jwtDecode(jwt);
   // console.log('decode toke', decToken);
    if (decToken.exp < Date.now() / 1000) {
      toast.error('مدت زمان زیادی از لحظه ورود شما به سیستم گذشته است. دوباره وارد شوید');
      logout();
      return null;
    }
    return decToken;

  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getCurrentUser,
  //loginWithJwt,
  getJwt
};
