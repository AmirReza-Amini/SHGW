import { FETCH_VOYAGES_REQUEST, FETCH_VOYAGES_FAILURE, FETCH_VOYAGES_SUCCESS } from './voyageTypes';

export const fetchVoyagesRequest = () => {
    return {
        type: FETCH_VOYAGES_REQUEST
    }
}

export const fetchVoyagesSuccess = voyages => {
    return {
        type: FETCH_VOYAGES_SUCCESS,
        payload: voyages
    }
}

export const fetchVoyagesFailure = error => {
    return {
        type: FETCH_VOYAGES_FAILURE,
        payload: error
    }
}