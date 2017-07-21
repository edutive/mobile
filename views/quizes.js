import React from 'react';
import { AppRegistry, Button, Text, TextInput, ListView, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';

class Quizes extends React.Component {
  static navigationOptions = {
    title: 'Quizes',
    headerTintColor: '#FFF',
    headerStyle: { backgroundColor: Constants.colors.blue },
    tabBarIcon: ({ tintColor }) => <Icon name="question" size={20} color={tintColor} />
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <Text>Quizes</Text>;
  }
}

module.exports = Quizes;