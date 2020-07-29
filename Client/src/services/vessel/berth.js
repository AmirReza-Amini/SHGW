import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/vessel/berth";

export const getCntrInfoForUnload = (data) => {
  return http.post(apiEndpoint + "/getCntrInfoForUnload", data);
};

export const saveUnload = (data) => {
  return http.post(apiEndpoint + "/saveUnload", data);
};

export const saveUnloadIncrement = (data) => {
  return http.post(apiEndpoint + "/saveUnloadIncrement", data);
};

export const addToShifting = (data) => {
  return http.post(apiEndpoint + "/addToShifting", data);
};

export const addToLoadingList = (data) => {
  return http.post(apiEndpoint + "/addToLoadingList", data);
};

export const isExistCntrInInstructionLoading = (data) => {
  return http.post(apiEndpoint + "/isExistCntrInInstructionLoading", data);
};
