import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/userType";


export const getUserTypes = () => {
    //console.log(apiEndpoint)
    return http.get(apiEndpoint);
}