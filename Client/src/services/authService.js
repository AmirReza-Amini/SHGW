import http from "./httpService";
import { apiUrl, tokenHashKey } from "../config.json";
import jwtDecode from "jwt-decode";
import * as CryptoJS from "crypto-js";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

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
    console.log(token, jwt);

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
  loginWithJwt,
  getJwt
};
