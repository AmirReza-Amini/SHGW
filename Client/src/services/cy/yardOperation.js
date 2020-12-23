import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/cy/yardOperation";


//#region Unload Services -----------------------------------------------------

export const getCntrInfoForYardOperation = (data) => {
    return http.post(apiEndpoint + "/getCntrInfoForYardOperation", data);
};


export const saveYardOperation = (data) => {
    return http.post(apiEndpoint + "/saveYardOperation", data);
  };