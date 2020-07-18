import { FETCH_EQUIPMENTS_FAILURE, FETCH_EQUIPMENTS_REQUEST, FETCH_EQUIPMENTS_SUCCESS } from './equipmentTypes';

export const fetchEquipmentsRequest = () => {
    return {
        type: FETCH_EQUIPMENTS_REQUEST
    }
}

export const fetchEquipmentsSuccess = equipments => {
    return {
        type: FETCH_EQUIPMENTS_SUCCESS,
        payload: equipments
    }
}

export const fetchEquipmentsFailure = error => {
    return {
        type: FETCH_EQUIPMENTS_FAILURE,
        payload: error
    }
}