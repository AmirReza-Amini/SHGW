import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/cy/movement";


//#region Movement Services -----------------------------------------------------

export const getCntrInfoForMovement = (data) => {
    return http.post(apiEndpoint + "/getCntrInfoForMovement", data);
};


export const saveMovement = (data) => {
    return http.post(apiEndpoint + "/saveMovement", data);
  };


  export const isDuplicateYardCodeByCntrNoInVoyage = (data) => {
    return http.post(apiEndpoint + "/isDuplicateYardCodeByCntrNoInVoyage", data);
  };