import React from 'react';
import { AppRegistry, Button, Text, TextInput, ListView, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

class Profile extends React.Component {
  static navigationOptions = {
    title: 'Perfil',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle,
    tabBarIcon: ({ tintColor }) => <Icon name="user" size={20} color={tintColor} />
  };

  constructor(props) {
    super(props);
  }

  logout() {
    firebase.auth().signOut().then(
      () => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Login' })]
        });

        this.props.navigation.dispatch(resetAction);
      },
      error => {
        Alert.alert('Error', 'Não foi possível realizar o logout.');
      }
    );
  }

  render() {
    return <Button title="Logout" onPress={() => this.logout()} />;
  }
}

module.exports = Profile;
