import {
  FETCH_DAMAGE_FAILURE,
  FETCH_DAMAGE_REQUEST,
  FETCH_DAMAGE_SUCCESS,
} from "./damageTypes";
import http from "../../../services/httpService";
import { apiUrl } from "../../../config.json";
import {getDamageDefinition} from '../../../services/damage';

const apiEndpoint = apiUrl + "/damage/";

export const fetchDamageRequest = () => {
  return {
    type: FETCH_DAMAGE_REQUEST,
  };
};

export const fetchDamageSuccess = (damages) => {
  return {
    type: FETCH_DAMAGE_SUCCESS,
    payload: damages,
  };
};

export const fetchDamageFailure = (error) => {
  return {
    type: FETCH_DAMAGE_FAILURE,
    payload: error,
  };
};

export const fetchDamageDefinition = () => {
  return async (dispatch) => {
    dispatch(fetchDamageRequest());
    getDamageDefinition()
      .then((response) => {
        const data = response.data.data.map((c) => {
          return {
            value: c.Letter,
            label: c.Letter,
            isSided: c.IsSided,
          };
        });
        dispatch(fetchDamageSuccess(data));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchDamageFailure(errorMsg));
      });
  };
};
