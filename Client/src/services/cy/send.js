import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/cy/send";


//#region Movement Services -----------------------------------------------------

export const isAlreadySentCntrNoByOperatorInVoyage = (data) => {
    return http.post(apiEndpoint + "/isAlreadySentCntrNoByOperatorInVoyage", data);
  };
  

export const saveSend = (data) => {
    return http.post(apiEndpoint + "/saveSend", data);
  };
