import {
    FETCH_OPERATOR_FAILURE,
    FETCH_OPERATOR_REQUEST,
    FETCH_OPERATOR_SUCCESS
  } from "./operatorTypes";
  
  export const initOperator = {
    loading: false,
    operator:{
      name:'',
      staffId:'',
      staffCode:''
    },
    error: "",
  };
  
  const operatorReducer = (state = initOperator, action) => {
    switch (action.type) {
      case FETCH_OPERATOR_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_OPERATOR_SUCCESS:
        return {
          loading: false,
          operator: action.payload,
          error: ""
        };
      case FETCH_OPERATOR_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state
    }
  };
  
  export default operatorReducer;