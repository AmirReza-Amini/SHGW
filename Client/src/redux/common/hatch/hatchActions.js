import {
    FETCH_HATCH_OPERATIONTYPES_FAILURE,
    FETCH_HATCH_OPERATIONTYPES_REQUEST,
    FETCH_HATCH_OPERATIONTYPES_SUCCESS,
    HATCH_OPERATIONTYPE_SELECTED_CHANGED,
    FETCH_HATCH_DIRECTIONS_FAILURE,
    FETCH_HATCH_DIRECTIONS_REQUEST,
    FETCH_HATCH_DIRECTIONS_SUCCESS,
    HATCH_DIRECTION_SELECTED_CHANGED
} from "./hatchTypes";

import { getHatchDirections, getHatchOperationTypes } from '../../../services/vessel/deck';

//#region Hatch Operation Types -----------------------------------------------

export const fetchHatchOperationTypesRequest = () => {
    return {
        type: FETCH_HATCH_OPERATIONTYPES_REQUEST,
    };
};

export const fetchHatchOperationTypesSuccess = (operationTypes) => {
    return {
        type: FETCH_HATCH_OPERATIONTYPES_SUCCESS,
        payload: operationTypes,
    };
};

export const fetchHatchOperationTypesFailure = (error) => {
    return {
        type: FETCH_HATCH_OPERATIONTYPES_FAILURE,
        payload: error,
    };
};

export const hatchOperationTypeSelectedChanged = (operationType) => {
    return {
        type: HATCH_OPERATIONTYPE_SELECTED_CHANGED,
        payload: operationType,
    };
};

export const fetchHatchOperationTypes = () => {
    return async (dispatch) => {
        dispatch(fetchHatchOperationTypesRequest());
        getHatchOperationTypes()
            .then((response) => {
                if (response.data.result) {
                    const data = response.data.data.map((c) => {
                        return { label: c.GeneralName, value: c.GeneralCode };
                    });
                    dispatch(fetchHatchOperationTypesSuccess(data));
                }
                else {
                    dispatch(fetchHatchOperationTypesFailure("Hatch operation types not found"));
                }
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchHatchOperationTypesFailure(errorMsg));
            });
    };
};

//#endregion ------------------------------------------------------------------

//#region Hatch Directions -----------------------------------------------

export const fetchHatchDirectionsRequest = () => {
    return {
        type: FETCH_HATCH_DIRECTIONS_REQUEST,
    };
};

export const fetchHatchDirectionsSuccess = (directions) => {
    return {
        type: FETCH_HATCH_DIRECTIONS_SUCCESS,
        payload: directions,
    };
};

export const fetchHatchDirectionsFailure = (error) => {
    return {
        type: FETCH_HATCH_DIRECTIONS_FAILURE,
        payload: error,
    };
};

export const hatchDirectionSelectedChanged = (direction) => {
    return {
        type: HATCH_DIRECTION_SELECTED_CHANGED,
        payload: direction,
    };
};

export const fetchHatchDirections = () => {
    return async (dispatch) => {
        dispatch(fetchHatchDirectionsRequest());
        getHatchDirections()
            .then((response) => {
                if (response.data.result) {
                    const data = response.data.data.map((c) => {
                        return { label: c.GeneralName, value: c.GeneralCode };
                    });
                    dispatch(fetchHatchDirectionsSuccess(data));
                }
                else {
                    dispatch(fetchHatchDirectionsFailure("Hatch directions not found"));
                }
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchHatchDirectionsFailure(errorMsg));
            });
    };
};

//#region Hatch Directions -----------------------------------------------

