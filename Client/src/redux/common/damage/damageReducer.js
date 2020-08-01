import {
  FETCH_DAMAGE_FAILURE,
  FETCH_DAMAGE_SUCCESS,
  FETCH_DAMAGE_REQUEST,
} from "./damageTypes";

export const initDamage = {
  loading: false,
  damages: [],
  error: "",
};

const damageReducer = (state = initDamage, action) => {
  switch (action.type) {
    case FETCH_DAMAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DAMAGE_SUCCESS:
      return {
        loading: false,
        damages: action.payload,
        error: "",
      };
    case FETCH_DAMAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default damageReducer;
