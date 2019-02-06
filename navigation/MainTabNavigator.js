import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import JourneyScreen from '../screens/JourneyScreen';
import TicktetsScreen from '../screens/TicktetsScreen';
import AccountsScreen from '../screens/AccountsScreen';
import WalletScreen from '../screens/WalletScreen';
import TempScreen from '../screens/TempScreen';



const TempStack = createStackNavigator({
  Temp: TempScreen,
});

TempStack.navigationOptions = {
  tabBarLabel: 'Temp',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'}
    />
  ),
};


const JourneyStack = createStackNavigator({
  Home: JourneyScreen,
});

JourneyStack.navigationOptions = {
  tabBarLabel: 'Journey',
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
  tabBarLabel: 'Tickets',
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
  tabBarLabel: 'Wallet',
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
  tabBarLabel: 'Account',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};





export default createBottomTabNavigator({
  TempStack,
  JourneyStack,
  TicketsStack,
  WalletStack,
  AccountStack

});
