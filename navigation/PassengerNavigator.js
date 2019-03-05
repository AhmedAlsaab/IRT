import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import JourneyScreen from '../screens/passenger/JourneyScreen';
import SummaryScreen from '../screens/passenger/SummaryScreen';
import TicketDetail from '../screens/TicketDetail';
import TicketsScreen from '../screens/TicktetsScreen';
import AccountsScreen from '../screens/passenger/AccountsScreen';
import AddFundsScreen from '../screens/passenger/AddFundsScreen';
import WalletScreen from '../screens/passenger/WalletScreen';
import ConfirmationScreen from '../screens/passenger/ConfirmationScreen';

const JourneyStack = createStackNavigator(
	{
		Home: JourneyScreen,
		Summary: SummaryScreen,
		Confirmation: ConfirmationScreen,
	},
	{
		initialRouteName: 'Home'
	}
);

JourneyStack.navigationOptions = {
	tabBarLabel: 'Plan & Buy',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'} />
};

const TicketsStack = createStackNavigator(
	{
		Ticket: TicketsScreen,
		Details: TicketDetail
	},
	{
		initialRouteName: 'Ticket'
	}
);

TicketsStack.navigationOptions = {
	tabBarLabel: 'My Tickets',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'} />
	)
};

const WalletStack = createStackNavigator(
	{
		Wallet: WalletScreen,
		AddFunds: AddFundsScreen
	},
	{ initialRouteName: 'Wallet' }
);

WalletStack.navigationOptions = {
	tabBarLabel: 'My Wallet',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'} />
};

const AccountStack = createStackNavigator({
	Account: AccountsScreen
});

AccountStack.navigationOptions = {
	tabBarLabel: 'Settings',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
	)
};

export default createBottomTabNavigator(
	{
		JourneyStack,
		TicketsStack,
		WalletStack,
		AccountStack
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
