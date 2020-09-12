import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/damage/";

export const getDamageDefinition = () => {
  return http.get(apiEndpoint + "getDamageDefinition");
};

export const getDamageInfoByActId = (data) => {
  return http.post(apiEndpoint + "getDamageInfoByActId", data);
};

export const setDamageInfoByActId = (data) => {
  return http.post(apiEndpoint + "setDamageInfoByActId", data);
};