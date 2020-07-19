import {
  FETCH_VOYAGES_TOPTENOPEN,
  FETCH_VOYAGES_FAILURE,
  FETCH_VOYAGES_REQUEST,
  FETCH_VOYAGES_SUCCESS,
} from "./voyageTypes";

const initialState = {
  loading: false,
  voyages: [],
  error: "",
};

const voyageReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VOYAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_VOYAGES_SUCCESS:
      return {
        loading: false,
        voyages: action.payload,
        error: "",
      };
    case FETCH_VOYAGES_FAILURE:
      return {
        loading: false,
        voyages: [],
        error: action.payload,
      };
    default:
      return initialState
  }
};

export default voyageReducer;