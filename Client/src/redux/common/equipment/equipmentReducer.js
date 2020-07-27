import {
    FETCH_EQUIPMENTS_FAILURE,
    FETCH_EQUIPMENTS_REQUEST,
    FETCH_EQUIPMENTS_SUCCESS,
    EQUIPMENT_SELECTED_CHANGED
  } from "./equipmentTypes";
  
  export const initEquipment = {
    loading: false,
    selectedEquipment:'',
    equipments: [],
    error: "",
  };
  
  const equipmentReducer = (state = initEquipment, action) => {
    switch (action.type) {
      case FETCH_EQUIPMENTS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_EQUIPMENTS_SUCCESS:
        return {
          loading: false,
          equipments: action.payload,
          error: "",
          selectedEquipment:''
        };
      case FETCH_EQUIPMENTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        case EQUIPMENT_SELECTED_CHANGED:
          return {
            ...state,
            selectedEquipment:action.payload
          }
      default:
        return state
    }
  };
  
  export default equipmentReducer;