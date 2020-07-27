import {
  FETCH_VOYAGES_FAILURE,
  FETCH_VOYAGES_REQUEST,
  FETCH_VOYAGES_SUCCESS,
  VOYAGE_SELECTED_CHANGED
} from "./voyageTypes";

export const initVoyage = {
  loading: false,
  selectedVoyage:'',
  voyages: [],
  error: "",
};

const voyageReducer = (state = initVoyage, action) => {
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
        selectedVoyage:''
      };
    case FETCH_VOYAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case VOYAGE_SELECTED_CHANGED:
        return {
          ...state,
          selectedVoyage:action.payload
        }
    default:
      return state
  }
};

export default voyageReducer;