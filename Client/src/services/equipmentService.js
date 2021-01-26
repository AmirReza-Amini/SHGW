import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/equipment/";

export const getEquipments = () => {
    //console.log('getEquipments')
    return http.get(apiEndpoint + 'getEquipments')
}