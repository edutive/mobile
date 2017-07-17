import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Login from './views/login';
import SignUp from './views/signup';
import Home from './views/home';

const Edutive = StackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Home: { screen: Home }
});

AppRegistry.registerComponent('edutive', () => Edutive);
