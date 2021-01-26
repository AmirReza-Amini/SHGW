import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/cy/receive";


//#region Movement Services -----------------------------------------------------

export const getCntrInfoForReceive = (data) => {
    return http.post(apiEndpoint + "/getCntrInfoForReceive", data);
};


export const saveReceive = (data) => {
    return http.post(apiEndpoint + "/saveReceive", data);
  };
