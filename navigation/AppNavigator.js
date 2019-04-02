import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import PassengerNavigator from './PassengerNavigator';
import DriverNavigator from './DriverNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegistrationScreen';


export default createAppContainer(
	createSwitchNavigator({
		// You could add another route here for authentication.
		// Read more at https://reactnavigation.org/docs/en/auth-flow.html
		//	Driver: DriverNavigator,
		Login: LoginScreen,
		Register: RegisterScreen,
		Passenger: PassengerNavigator,
		Driver: DriverNavigator,
	})
);
