import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/damage";

export const isPossibleSaveAct = (data) => {
  return http.post(apiEndpoint + "/isPossibleSaveAct", data);
};
