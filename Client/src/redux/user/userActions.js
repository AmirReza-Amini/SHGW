import {
  FETCH_USER_REQUEST,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS
} from "./userTypes";
import http from "../../services/httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/voyage/";

export const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

export const fetchVoyagesSuccess = (voyages) => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: voyages,
  };
};

export const fetchVoyagesFailure = (error) => {
  return {
    type: FETCH_USER_FAILURE,
    payload: error,
  };
};


export const fetchVoyagesTopTenOpen = () => {
  return async (dispatch) => {
    dispatch(fetchVoyagesRequest());
    http
      .get(apiEndpoint)
      .then((response) => {
        //console.log('res',response)
        const data = response.data.data.map((c) => {
          return {
            value: c.VoyageID,
            label: `Voyage: ${c.VoyageNo} - Ship: ${c.ShipName}`,
          };
        });
        dispatch(fetchVoyagesSuccess(data));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchVoyagesFailure(errorMsg));
      });
  };
};
