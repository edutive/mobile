import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import Constants from './contants';

import Login from './views/login';
import SignUp from './views/signup';

import Quizes from './views/quizes';
import Subjects from './views/subjects';
import Messages from './views/messages';
import Profile from './views/profile';

global.USER = null;

const Home = TabNavigator(
  {
    Quizes: { screen: Quizes },
    Subjects: { screen: Subjects },
    Messages: { screen: Messages },
    Profile: { screen: Profile }
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: Constants.colors.orange,
      inactiveTintColor: Constants.colors.blue,
      labelStyle: {
        fontSize: 14,
        marginBottom: 10
      },
      style: {
        height: 70,
        backgroundColor: 'white',
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2
        },
        shadowRadius: 5,
        shadowOpacity: 0.05
      }
    }
  }
);

const Edutive = StackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Home: { screen: Home }
});

AppRegistry.registerComponent('edutive', () => Edutive);
