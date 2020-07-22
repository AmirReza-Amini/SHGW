import {
  FETCH_VOYAGES_REQUEST,
  FETCH_VOYAGES_FAILURE,
  FETCH_VOYAGES_SUCCESS,
  VOYAGE_SELECTED_CHANGED
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

export const voyageSelectedChanged = (voyage) => {
  return {
    type: VOYAGE_SELECTED_CHANGED,
    payload: voyage,
  };
};

export const fetchVoyagesTopTenOpen = () => {
  return (dispatch) => {
    dispatch(fetchVoyagesRequest());
    http
    .get('http://localhost:4000/api/voyage')
      //.get(apiEndpoint + "getVoyagesTopTenOpen")
      .then((response) => {
        console.log('res',response)
        const data = response.data.data.map((c) => {
          return { value: c.VoyageID, label: `Voyage: ${c.VoyageNo} - Ship: ${c.ShipName}` };
        });
        dispatch(fetchVoyagesSuccess(data));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchVoyagesFailure(errorMsg));
      });
  };
};
