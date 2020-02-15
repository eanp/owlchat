import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import MmIcon from 'react-native-vector-icons/AntDesign';
import MfIcon from 'react-native-vector-icons/Feather';
import MoIcon from 'react-native-vector-icons/Octicons';

import Location from '../containers/pages/Location';
import User from '../containers/pages/User';
import MainScreen from '../containers/pages/MainScreen';
import SplashScreen from '../containers/pages/SplashScreen';

import Login from '../containers/pages/Login';
import Chat from '../containers/pages/Chat';
import Signup from '../containers/pages/Signup';

import OneSignal from 'react-native-onesignal';

const UserNav = createStackNavigator(
  {
    User: {
      screen: User,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'User',
  },
);
UserNav.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};
const LocationNav = createStackNavigator(
  {
    Location: {
      screen: Location,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'Location',
  },
);
LocationNav.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const MainScreenNav = createStackNavigator(
  {
    MainScreen: {
      screen: MainScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Chat: {
      screen: Chat,
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
        title: 'owlchat',
        tabBarIcon: ({tintColor}) => {
          return <MmIcon name="home" size={22} color={tintColor} />;
        },
      },
    },
    MainScreen2: {
      screen: LocationNav,
      navigationOptions: {
        title: 'location',
        tabBarIcon: ({tintColor}) => {
          return <MoIcon name="location" size={22} color={tintColor} />;
        },
      },
    },
    MainScreen3: {
      screen: UserNav,
      navigationOptions: {
        title: 'user',
        tabBarIcon: ({tintColor}) => {
          return <MfIcon name="user" size={22} color={tintColor} />;
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
      activeTintColor: '#7C80EE',
      inactiveTintColor: '#A2A7C0',
      style: {
        backgroundColor: 'white',
        borderTopColor: 'transparent',
        height: 60,
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
    Signup: {screen: Signup},
  },
  {
    initialRouteName: 'SplashScreen',
  },
);

const AppContainer = createAppContainer(SwitchNav);

class Router extends Component {
  constructor(props) {
    super(props);
    OneSignal.init('6c2bd3eb-2d0d-4c41-acea-74b268424ba4');
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  render() {
    return <AppContainer />;
  }
}

export default Router;
