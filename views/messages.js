import React from 'react';
import { AppRegistry, Button, Text, TextInput, ListView, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

class Messages extends React.Component {
  static navigationOptions = {
    title: 'Mensagens',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle,
    tabBarIcon: ({ tintColor }) => <Icon name="bubbles" size={20} color={tintColor} />
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <Text>Mensagens</Text>;
  }
}

module.exports = Messages;
