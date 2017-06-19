import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Login from './views/login';
import Home from './views/home';

const Edutive = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home }
});

AppRegistry.registerComponent('edutive', () => Edutive);
