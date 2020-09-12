import {
  FETCH_OPERATOR_SUCCESS,
  FETCH_OPERATOR_REQUEST,
  FETCH_OPERATOR_FAILURE,
} from "./operatorTypes";
import {getOperatorInfoBasedOnCode} from '../../../services/operatorService';

export const fetchOperatorRequest = () => {
  return {
    type: FETCH_OPERATOR_REQUEST,
  };
};

export const fetchOperatorSuccess = (operator) => {
  return {
    type: FETCH_OPERATOR_SUCCESS,
    payload: operator,
  };
};

export const fetchOperatorFailure = (error) => {
  return {
    type: FETCH_OPERATOR_FAILURE,
    payload: error,
  };
};

export const fetchOperatorInfoBasedOnCode = (code) => {
  return async (dispatch) => {
    dispatch(fetchOperatorRequest());
    getOperatorInfoBasedOnCode(code)
      .then((response) => {
        if (response.data.result){
          const data = response.data.data.map((c) => {
            return { name: c.Name, staffCode: c.StaffCode, staffId: c.StaffID };
          });
          dispatch(fetchOperatorSuccess(data[0]));
        }
        else{
          dispatch(fetchOperatorFailure("کد اپراتور یافت نشد"));
        }
        
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchOperatorFailure(errorMsg));
      });
  };
};
