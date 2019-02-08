import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import JourneyScreen from '../screens/JourneyScreen';
import TicktetsScreen from '../screens/TicktetsScreen';
import AccountsScreen from '../screens/AccountsScreen';
import WalletScreen from '../screens/WalletScreen';







const JourneyStack = createStackNavigator({
  Home: JourneyScreen
});

JourneyStack.navigationOptions = {
  tabBarLabel: 'Plan & Buy',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'}
    />
  ),
};

const TicketsStack = createStackNavigator({
  Ticket: TicktetsScreen,
});

TicketsStack.navigationOptions = {
  tabBarLabel: 'My Tickets',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
    />
  ),
};

const WalletStack = createStackNavigator({
  Links: WalletScreen,
});

WalletStack.navigationOptions = {
  tabBarLabel: 'My Wallet',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
    />
  ),
};

const AccountStack = createStackNavigator({
  Account: AccountsScreen,
});

AccountStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  ),
};


export default createBottomTabNavigator({
  JourneyStack,
  TicketsStack,
  WalletStack,
  AccountStack

});
