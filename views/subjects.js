import React from 'react';
import { AppRegistry, Button, Text, TextInput, ListView, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

class Subjects extends React.Component {
  static navigationOptions = {
    title: 'Disciplinas',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle,
    tabBarIcon: ({ tintColor }) => <Icon name="graduation" size={20} color={tintColor} />
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <Text>Disciplinas</Text>;
  }
}

module.exports = Subjects;
