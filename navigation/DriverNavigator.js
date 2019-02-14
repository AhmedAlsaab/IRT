import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import MySchedule from '../screens/driver/MySchedule';
import RouteScreen from '../screens/driver/RouteScreen';

const MyScheduleStack = createStackNavigator(
	{
		Home: MySchedule,
		Route: RouteScreen
	},
	{
		initialRouteName: 'Route'
	}
);

MyScheduleStack.navigationOptions = {
	tabBarLabel: 'Schedule',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'} />
};

export default createBottomTabNavigator({
	MyScheduleStack
});
