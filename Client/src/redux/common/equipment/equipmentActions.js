import {
  FETCH_EQUIPMENTS_FAILURE,
  FETCH_EQUIPMENTS_REQUEST,
  FETCH_EQUIPMENTS_SUCCESS,
  EQUIPMENT_SELECTED_CHANGED,
} from "./equipmentTypes";
import { getEquipments } from '../../../services/equipmentService';


export const fetchEquipmentsRequest = () => {
  return {
    type: FETCH_EQUIPMENTS_REQUEST
  };
};

export const fetchEquipmentsSuccess = (equipments) => {
  return {
    type: FETCH_EQUIPMENTS_SUCCESS,
    payload: equipments
  };
};

export const fetchEquipmentsFailure = (error) => {
  return {
    type: FETCH_EQUIPMENTS_FAILURE,
    payload: error,
  };
};

export const equipmentSelectedChanged = (equipment, equipmentType) => {
  return {
    type: EQUIPMENT_SELECTED_CHANGED,
    payload: equipment,
    equipmentType: equipmentType
  };
};

export const fetchEquipments = () => {
  console.log('fetchEquipments')
  return async (dispatch) => {
    dispatch(fetchEquipmentsRequest());
    getEquipments()
      .then((response) => {
        console.log('fetchEquipments response',response);
        const data = response.data.data.map((c) => {
          return { value: c.EquipmentID, label: c.EquipmentName, type: c.EquipmentType };
        });
        dispatch(fetchEquipmentsSuccess(data));
      })
      .catch((error) => {
        const errorMsg = error.message;
        console.log('fetchEquipmentserror')
        dispatch(fetchEquipmentsFailure(errorMsg));
      });
  };
};

