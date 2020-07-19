import {
  FETCH_VOYAGES_REQUEST,
  FETCH_VOYAGES_FAILURE,
  FETCH_VOYAGES_SUCCESS
} from "./voyageTypes";
import http from "../../../services/httpService";
import { apiUrl } from "../../../config.json";

const apiEndpoint = apiUrl + "/voyages/";

export const fetchVoyagesRequest = () => {
  return {
    type: FETCH_VOYAGES_REQUEST,
  };
};

export const fetchVoyagesSuccess = (voyages) => {
  return {
    type: FETCH_VOYAGES_SUCCESS,
    payload: voyages,
  };
};

export const fetchVoyagesFailure = (error) => {
  return {
    type: FETCH_VOYAGES_FAILURE,
    payload: error,
  };
};

export const fetchVoyagesTopTenOpen = () => {
  return (dispatch) => {
    dispatch(fetchVoyagesRequest());
    http
      .get(apiEndpoint + "getVoyagesTopTenOpen")
      .then((response) => {
        const data = response.data;
        dispatch(fetchVoyagesSuccess(data));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchVoyagesFailure(errorMsg));
      });
  };
};
