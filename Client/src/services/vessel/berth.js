import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/vessel/berth";


//#region Unload Services -----------------------------------------------------

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

//#endregion ----------------------------------------------------------------

//#region Load Services -----------------------------------------------------

export const getCntrInfoForLoad = (data) => {
  return http.post(apiEndpoint + "/getCntrInfoForLoad", data);
};

export const saveLoad = (data) => {
  return http.post(apiEndpoint + "/saveLoad", data);
};
