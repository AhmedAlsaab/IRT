import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import MySchedule from '../screens/driver/MySchedule';
import RouteScreen from '../screens/driver/RouteScreen';
import DriverSchedule from '../screens/driver/DriverSchedule';
import LoginScreen from '../screens/LoginScreen';

const MyScheduleStack = createStackNavigator(
	{
		DailySchedule: DriverSchedule,
		SelectedJourney: MySchedule,
		Route: RouteScreen,
		Login: LoginScreen
	},
	{
		initialRouteName: 'DailySchedule'
	}
);

MyScheduleStack.navigationOptions = {
	tabBarLabel: 'Schedule',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'} />
};

export default createBottomTabNavigator(
	{
		MyScheduleStack
	},
	{
		tabBarOptions: {
			activeTintColor: 'white',
			inactiveTintColor: '#cccccc',
			style: {
				backgroundColor: '#ff0000'
			}
		}
	}
);
