import { UPDATE_LOCATION } from './types';

export function updateLocation(newLocation) {
	return {
		type: UPDATE_LOCATION,
		payload: newLocation
	};
}
