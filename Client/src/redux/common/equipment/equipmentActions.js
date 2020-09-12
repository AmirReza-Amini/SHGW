import {
  FETCH_EQUIPMENTS_FAILURE,
  FETCH_EQUIPMENTS_REQUEST,
  FETCH_EQUIPMENTS_SUCCESS,
  EQUIPMENT_SELECTED_CHANGED,
} from "./equipmentTypes";
import {getEquipmentsForLoadUnload} from '../../../services/equipmentService';


export const fetchEquipmentsRequest = () => {
  return {
    type: FETCH_EQUIPMENTS_REQUEST,
  };
};

export const fetchEquipmentsSuccess = (equipments) => {
  return {
    type: FETCH_EQUIPMENTS_SUCCESS,
    payload: equipments,
  };
};

export const fetchEquipmentsFailure = (error) => {
  return {
    type: FETCH_EQUIPMENTS_FAILURE,
    payload: error,
  };
};

export const equipmentSelectedChanged = (equipment) => {
    return {
      type: EQUIPMENT_SELECTED_CHANGED,
      payload: equipment,
    };
  };

  export const fetchEquipmentsForLoadUnload = () => {
    return async (dispatch) => {
      dispatch(fetchEquipmentsRequest());
      getEquipmentsForLoadUnload()
        .then((response) => {
          const data = response.data.data.map((c) => {
            return { value: c.EquipmentID, label: c.EquipmentName };
          });
          dispatch(fetchEquipmentsSuccess(data));
        })
        .catch((error) => {
          const errorMsg = error.message;
          dispatch(fetchEquipmentsFailure(errorMsg));
        });
    };
  };
  