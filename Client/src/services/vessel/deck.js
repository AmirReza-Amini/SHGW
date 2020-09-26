import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/vessel/deck";


//#region Stowage Services --------------------------------------------------

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

//#region Hatch Services ----------------------------------------------------

export const getHatchOperationTypes = () => {
  return http.get(apiEndpoint + "/getHatchOperationTypes");
};

export const getHatchDirections = () => {
  return http.get(apiEndpoint + "/getHatchDirections");
};

export const saveVesselHatchInfo = (data) => {
  return http.post(apiEndpoint + "/saveVesselHatchInfo", data);
};

export const getVesselHatchInfoByVoyage = (voyageId) => {
  return http.get(apiEndpoint + `/getVesselHatchInfoByVoyage/${voyageId}`);
}

//#endregion ----------------------------------------------------------------
