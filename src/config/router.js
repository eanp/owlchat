import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import MmIcon from 'react-native-vector-icons/AntDesign';

import MainScreen from '../containers/pages/MainScreen';
import SplashScreen from '../containers/pages/SplashScreen';

import Login from '../containers/pages/Login';
import Chat from '../containers/pages/Chat';
import Signup from '../containers/pages/Signup';

import OneSignal from 'react-native-onesignal';

const MainScreenNav = createStackNavigator(
  {
    MainScreen: {
      screen: MainScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'MainScreen',
  },
);
MainScreenNav.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};
const BottomNav = createBottomTabNavigator(
  {
    MainScreen: {
      screen: MainScreenNav,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <MmIcon name="search1" size={25} color={tintColor} />;
        },
      },
    },
    MainScreen2: {
      screen: MainScreenNav,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <MmIcon name="search1" size={25} color={tintColor} />;
        },
      },
    },
    MainScreen3: {
      screen: MainScreenNav,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <MmIcon name="search1" size={25} color={tintColor} />;
        },
      },
    },
    MainScreen4: {
      screen: MainScreenNav,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <MmIcon name="search1" size={25} color={tintColor} />;
        },
      },
    },
  },
  {
    initialRouteName: 'MainScreen',
    tabBarOptions: {
      labelStyle: {
        marginBottom: 5,
      },
      activeTintColor: '#C81E1F',
      inactiveTintColor: '#ACACAC',
      style: {
        backgroundColor: 'white',
        borderTopColor: 'transparent',
        marginVertical: 3,
      },
    },
  },
);

const AppStack = createStackNavigator(
  {
    BottomNav,
  },
  {
    headerMode: 'none',
    initialRouteName: 'BottomNav',
  },
);

const SwitchNav = createSwitchNavigator(
  {
    AppStack,
    SplashScreen: {screen: SplashScreen},
    Login: {screen: Login},
    Chat: {screen: Chat},
    Signup: {screen: Signup},
  },
  {
    initialRouteName: 'Login',
  },
);

const AppContainer = createAppContainer(SwitchNav);

class Router extends Component {
  constructor(props) {
    super(props);
    OneSignal.init('42c6ef87-b4d7-44d1-983d-749dd12ddcc5');
  }

  render() {
    return <AppContainer />;
  }
}

export default Router;
