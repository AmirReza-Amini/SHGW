import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/voyage";


export const getLoadUnloadStatisticsByVoyageId = (data) =>{
    console.log(apiEndpoint + '/getLoadUnloadStatisticsByVoyageId')
    return http.post(apiEndpoint + '/getLoadUnloadStatisticsByVoyageId',data)
}