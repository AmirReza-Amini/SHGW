import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/user";


export const getUsers = () => {
    //console.log(apiEndpoint)
    return http.get(apiEndpoint);
}

export const deleteUserInfo = (userId) => {
    //console.log(apiEndpoint + `/${userId}`)
    return http.delete(apiEndpoint + `/${userId}`);
}

export const editUserInfo = (userInfo) => {
    //console.log('api for edit user info', userInfo)
    return http.put(apiEndpoint,userInfo);
}