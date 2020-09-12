import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/voyage/";


export const getVoyageTopTenOpen = (data) =>{
     return http.get(apiEndpoint)
 }

export const getLoadUnloadStatisticsByVoyageId = (data) =>{
   // console.log(apiEndpoint + '/getLoadUnloadStatisticsByVoyageId')
    return http.post(apiEndpoint + 'getLoadUnloadStatisticsByVoyageId',data)
}