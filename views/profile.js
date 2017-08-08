import React from 'react';
import { AppRegistry, Button, Text, TextInput, ListView, Alert, View, Image, StyleSheet, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import UserPicture from '../components/userPicture';

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
        AsyncStorage.removeItem('user', error => {
          if (!error) {
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Login' })]
            });

            this.props.navigation.dispatch(resetAction);
          }
        });
      },
      error => {
        Alert.alert('Error', 'Não foi possível realizar o logout.');
      }
    );
  }

  editProfile() {
    this.props.navigation.navigate('SignUp', global.USER);
  }

  render() {
    return (
      <View style={styles.header}>
        <UserPicture big={true} picture={global.USER.picture} firstname={global.USER.firstname} lastname={global.USER.lastname} />
        <Text style={styles.title}>
          {`${global.USER.firstname} ${global.USER.lastname}`}
        </Text>
        <View style={styles.logout}>
          <Icon name="pencil" size={20} color="#FFF" onPress={this.editProfile.bind(this)} />
          <Icon name="logout" size={20} color="#FFF" onPress={this.logout.bind(this)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.colors.blue
  },
  title: {
    fontSize: 22,
    color: '#FFF',
    marginTop: 16
  },
  logout: {
    position: 'absolute',
    top: 32,
    right: 16
  }
});

module.exports = Profile;
