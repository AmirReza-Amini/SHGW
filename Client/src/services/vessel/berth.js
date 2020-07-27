import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/vessel/berth";

export const getCntrInfoForUnload = (data) => {
  return http.post(apiEndpoint + '/getCntrInfoForUnload', data);
};
