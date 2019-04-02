import { ADD_VEHICLE, REMOVE_VEHICLE, FETCH_VEHICLES, SELECT_VEHICLE } from './types';
import ip from '../../ipstore';
import { getRequestAuthorized } from '../../API';

export function addVehicle(vehicle) {
	return {
		type: ADD_VEHICLE,
		payload: vehicle
	};
}

export function removeVehicle(vehicleId) {
	return {
		type: REMOVE_VEHICLE,
		payload: vehicleId
	};
}

export function selectVehicle(data) {
	return {
		type: SELECT_VEHICLE,
		payload: data
	};
}

export function fetchVehicles() {
	return function(dispatch) {
		getRequestAuthorized(`http://${ip}:3000/driver/vehicles/getVehicles`).then((response) => {
			dispatch({
				type: FETCH_VEHICLES,
				payload: response
			});
		});
	};
}
