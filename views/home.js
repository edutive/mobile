import React from 'react';
import { AppRegistry, Text, TextInput, ListView } from 'react-native';

class Home extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  render() {
    return <Text>Home</Text>;
  }
}

module.exports = Home;
