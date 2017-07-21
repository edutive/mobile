import React from 'react';
import { AppRegistry, Button, Text, TextInput, ListView, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

class Subjects extends React.Component {
  static navigationOptions = {
    title: 'Disciplinas',
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
