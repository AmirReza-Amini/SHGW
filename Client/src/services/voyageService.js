import http from '../services/httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + "/voyages";

export const getTopTenOpenVoyages = () =>{
    return http.get('https://jsonplaceholder.typicode.com/users')
}