import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/vessel/deck";


//#region Stowage Services -----------------------------------------------------

export const getCntrInfoForStowage = (data) => {
  return http.post(apiEndpoint + "/getCntrInfoForStowage", data);
};

export const getStowageInfoForCntrByVoyage = (data) => {
  return http.post(apiEndpoint + "/getStowageInfoForCntrByVoyage", data);
};

export const isOccoupiedBayAddressInVoyage = (data) => {
  return http.post(apiEndpoint + "/isOccoupiedBayAddressInVoyage", data);
};

export const saveStowageAndShiftedup = (data) => {
  return http.post(apiEndpoint + "/saveStowageAndShiftedup", data);
};

//#endregion ----------------------------------------------------------------