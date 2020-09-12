import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/equipment/";

export const getEquipmentsForLoadUnload = () =>{
    return http.get(apiEndpoint + 'getEquipmentsForLoadUnload')
}