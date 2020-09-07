import http from "./httpService";
import { apiUrl, tokenHashKey } from "../config.json";
import jwtDecode from "jwt-decode";
import * as CryptoJS from "crypto-js";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(user) {
  const { data } = await http.post(apiEndpoint, user);
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

    return jwtDecode(jwt);
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
