import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/vessel/berth";

export const getCntrInfoForUnload = (data) => {
  return http.post(apiEndpoint + "/getCntrInfoForUnload", data);
};

export const saveUnload = (data) => {
  return http.post(apiEndpoint + "/saveUnload", data);
};

export const addToShifting = (data) => {
  return http.post(apiEndpoint + "/addToShifting", data);
};

export const addToLoadingList = (data) => {
  return http.post(apiEndpoint + "/addToLoadingList", data);
};
