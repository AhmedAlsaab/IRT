import { UPDATE_LOCATION } from '../actions/types';

const initialState = {
	newLocation: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case UPDATE_LOCATION:
			return {
				...state,
				newLocation: action.payload
			};
		default:
			return state;
	}
}
