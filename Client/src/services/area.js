import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/area";


export const getAreas = () => {
    //console.log(apiEndpoint)
    return http.get(apiEndpoint);
}

