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

  render() {
    return (
      <View style={styles.header}>
        <View style={styles.picture}>
          <Text style={styles.pictureLabel}>
            {global.USER.firstname.substr(0, 1).toUpperCase()}
            {global.USER.lastname.substr(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.title}>
          {`${global.USER.firstname} ${global.USER.lastname}`}
        </Text>
        <Icon
          name="logout"
          size={20}
          color="#FFF"
          onPress={this.logout.bind(this)}
          style={styles.logout}
        />
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
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.colors.orange
  },
  pictureLabel: {
    fontSize: 30,
    color: '#FFF'
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
