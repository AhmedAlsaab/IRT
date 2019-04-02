import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer';
import userReducer from './userReducer';
import driverReducer from './driverReducer';
import ticketReducer from './ticketReducer';
import vehicleReducer from './vehicleReducer';

export default combineReducers({
	transactionReducer: transactionReducer,
	userReducer: userReducer,
	ticketReducer: ticketReducer,
	driverReducer: driverReducer,
	vehicleReducer: vehicleReducer
});
