import React from 'react';
import {
  AppRegistry,
  Button,
  Text,
  TextInput,
  ListView,
  Alert,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

class Results extends React.Component {
  static navigationOptions = {
    title: 'Resultados',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <View />;
  }
}

const styles = StyleSheet.create({});

module.exports = Results;
