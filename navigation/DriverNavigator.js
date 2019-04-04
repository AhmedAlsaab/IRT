import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import colors from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import MySchedule from '../screens/driver/MySchedule';
import RouteScreen from '../screens/driver/RouteScreen';
import DriverSchedule from '../screens/driver/DriverSchedule';
import VehiclesScreen from './../screens/driver/VehiclesScreen';
import AccountsScreen from './../screens/driver/AccountsScreen';
import AddVehicle from './../screens/driver/AddVehicle';
import MakeModelSelect from '../screens/driver/MakeModelSelect';
import EmergencyContact from '../components/EmergencyContact';
import ChangeDriverDetails from '../components/ChangeDriverDetails';
import DriverPassword from '../components/DriverPassword';

const MyScheduleStack = createStackNavigator(
	{
		DailySchedule: DriverSchedule,
		SelectedJourney: MySchedule,
		Route: RouteScreen
	},
	{
		initialRouteName: 'DailySchedule'
	}
);

const AccountStack = createStackNavigator(
	{
		Account: AccountsScreen,
		EmergencyContact: EmergencyContact,
		ChangeDetails: ChangeDriverDetails,
		DriverPassword: DriverPassword
	},
	{ initialRouteName: 'Account' }
);

AccountStack.navigationOptions = {
	tabBarLabel: 'Settings',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
	)
};

MyScheduleStack.navigationOptions = {
	tabBarLabel: 'My Schedule',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} />
	)
};

const VehiclesStack = createStackNavigator(
	{
		MyVehicles: VehiclesScreen,
		AddVehicle: AddVehicle,
		MakeModelSelect: MakeModelSelect
	},
	{
		initialRouteName: 'MyVehicles'
	}
);

VehiclesStack.navigationOptions = {
	tabBarLabel: 'My Vehicles',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'} />
};

export default createBottomTabNavigator(
	{
		MyScheduleStack,
		VehiclesStack,
		AccountStack
	},
	{
		tabBarOptions: {
			activeTintColor: colors.tabIconSelected,
			inactiveTintColor: colors.tabIconDefault,
			style: {
				backgroundColor: colors.brandColor
			}
		}
	}
);
