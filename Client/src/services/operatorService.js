import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/operator/";

export const getOperatorInfoBasedOnCode = (code) =>{
    return http.get(apiEndpoint + `getOperatorInfoBasedOnCode/${code}`)
}