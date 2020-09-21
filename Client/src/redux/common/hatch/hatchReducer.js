import {
  FETCH_HATCH_DIRECTIONS_FAILURE,
  FETCH_HATCH_OPERATIONTYPES_FAILURE,
  FETCH_HATCH_DIRECTIONS_SUCCESS,
  FETCH_HATCH_OPERATIONTYPES_SUCCESS,
  FETCH_HATCH_DIRECTIONS_REQUEST,
  FETCH_HATCH_OPERATIONTYPES_REQUEST,
  HATCH_DIRECTION_SELECTED_CHANGED,
  HATCH_OPERATIONTYPE_SELECTED_CHANGED
} from "./hatchTypes";

export const initHatch = {
  loading: false,
  selectedHatchOperationType: '',
  selectedHatchDirection: '',
  hatchOperationTypes: [],
  hatchDirections: [],
  error: "",
};

const hatchReducer = (state = initHatch, action) => {
  switch (action.type) {
    case FETCH_HATCH_DIRECTIONS_REQUEST:
    case FETCH_HATCH_OPERATIONTYPES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_HATCH_DIRECTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        hatchDirections: action.payload,
        error: "",
        selectedHatchDirection: ''
      };
    case FETCH_HATCH_OPERATIONTYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        hatchOperationTypes: action.payload,
        error: "",
        selectedHatchOperationType: ''
      };
    case FETCH_HATCH_DIRECTIONS_FAILURE:
    case FETCH_HATCH_OPERATIONTYPES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case HATCH_DIRECTION_SELECTED_CHANGED:
      return {
        ...state,
        selectedHatchDirection: action.payload
      }
    case HATCH_OPERATIONTYPE_SELECTED_CHANGED:
      return {
        ...state,
        selectedHatchOperationType: action.payload
      }
    default:
      return state
  }
};

export default hatchReducer;