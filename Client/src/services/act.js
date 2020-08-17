import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/act";

export const isPossibleSaveAct = (data) => {
  return http.post(apiEndpoint + "/isPossibleSaveAct", data);
};
