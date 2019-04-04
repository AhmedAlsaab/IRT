import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import colors from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import JourneyScreen from '../screens/passenger/JourneyScreen';
import SummaryScreen from '../screens/passenger/SummaryScreen';
import TicketDetail from '../components/TicketDetail';
import TicketsScreen from '../screens/passenger/TicktetsScreen';
import AccountsScreen from '../screens/passenger/AccountsScreen';
import AddFundsScreen from '../screens/passenger/AddFundsScreen';
import WalletScreen from '../screens/passenger/WalletScreen';
import TrackDriver from '../screens/passenger/TrackDriver';
import ConfirmationScreen from '../screens/passenger/ConfirmationScreen';
import RecentFavScreen from '../screens/passenger/RecentFavScreen';
import AmendTicket from '../screens/passenger/AmendTicket';
import ResultScreen from '../screens/passenger/ResultScreen';
import ChangePassword from '../components/ChangePassword';
import ContactScreen from '../components/ContactScreen';
import ChangeDetailsScreen from '../components/ChangeDetailsScreen';
import AddressScreen from '../components/AddressScreen';
import PaymentConfirmationScreen from '../screens/passenger/PaymentConfirmationScreen'

const JourneyStack = createStackNavigator(
	{
		Home: JourneyScreen,
		Summary: SummaryScreen,
		Results: ResultScreen,
		RecentFav: RecentFavScreen,
		Confirmation: ConfirmationScreen
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
		Details: TicketDetail,
		Amend: AmendTicket,
		Track: TrackDriver
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
		AddFunds: AddFundsScreen,
		PaymentConfirmation: PaymentConfirmationScreen 
	},
	{ initialRouteName: 'Wallet' }
);

WalletStack.navigationOptions = {
	tabBarLabel: 'My Wallet',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'} />
};

const AccountStack = createStackNavigator(
	{
		Account: AccountsScreen,
		Contact: ContactScreen,
		Settings: AccountsScreen,
		ChangeDetails: ChangeDetailsScreen,
		ChangePassword: ChangePassword,
		AddAddress: AddressScreen,
	},
	{ initialRouteName: 'Account' }
);

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
			activeTintColor: colors.tabIconSelected,
			inactiveTintColor: colors.tabIconDefault,
			style: {
				backgroundColor: colors.brandColor
			}
		}
	}
);
