import React from 'react';
import { AppRegistry, Text, Button, View } from 'react-native';

import { LoginManager, AccessToken } from 'react-native-fbsdk';
import firebase from '../firebase';

class Login extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor(props) {
    super(props);

    firebase.database().ref('users').on('value', snapshot => {
      const value = snapshot.val();
      console.log('users', value);
    });
  }

  login() {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      result => {
        console.log(result);
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          alert(
            'Login success with permissions: ' +
              result.grantedPermissions.toString()
          );

          AccessToken.getCurrentAccessToken().then(data => {
            alert(data.accessToken.toString());
          });
        }
      },
      error => {
        alert('Login fail with error: ' + error);
      }
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Button title="Login" onPress={() => this.login()} />
      </View>
    );
  }
}

module.exports = Login;
