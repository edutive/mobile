import React from 'react';
import { AppRegistry, Text, Button, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert, AsyncStorage } from 'react-native';

const { width, height } = Dimensions.get('window');

import { NavigationActions } from 'react-navigation';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import firebase from '../firebase';

import Constants from '../contants';
import Styles from '../styles';

class Login extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('user', (error, user) => {
      if (!error && user) {
        global.USER = JSON.parse(user);

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Home' })]
        });

        this.props.navigation.dispatch(resetAction);
      }
    });
  }

  signup() {
    this.props.navigation.navigate('SignUp');
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        firebase.database().ref('users/' + user.uid).once('value', snapshot => {
          const userObject = {
            uid: user.uid,
            firstname: snapshot.val().firstname,
            lastname: snapshot.val().lastname,
            email: user.email
          };

          global.USER = userObject;

          AsyncStorage.setItem('user', JSON.stringify(userObject), error => {
            if (!error) {
              const resetAction = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })]
              });

              this.props.navigation.dispatch(resetAction);
            }
          });
        });
      })
      .catch(error => {
        Alert.alert('Error', 'Não foi possível realizar o login, verifique seu e-mail e senha');
      });
  }

  facebookLogin() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then(result => {
        if (result.isCancelled) {
          return Promise.resolve('cancelled');
        } else {
          return AccessToken.getCurrentAccessToken();
        }
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

        return firebase.auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        if (currentUser === 'cancelled') {
          console.log('Login cancelled');
        } else {
          console.log(currentUser.toJSON());
          const name = currentUser.displayName.split(' ');

          global.USER = {
            uid: currentUser.uid,
            email: currentUser.email,
            firstname: name[0],
            lastname: name.length > 1 ? name[name.length - 1] : '',
            picture: currentUser.photoURL,
            facebookId: currentUser.providerData[0].uid
          };

          firebase.database().ref('users').child(global.USER.uid).set(global.USER);

          AsyncStorage.setItem('user', JSON.stringify(global.USER), error => {
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Home' })]
            });

            this.props.navigation.dispatch(resetAction);
          });
        }
      })
      .catch(error => {
        alert('Login fail with error: ' + error);
      });
  }

  render() {
    return (
      <ScrollView style={styles.scroll} ref="scroll">
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={Styles.label}>E-mail</Text>
            <View style={Styles.inputArea}>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                style={Styles.input}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                onFocus={() => this.refs.scroll.scrollTo({ x: 0, y: 70, animated: true })}
                onSubmitEditing={() => this.refs.password.focus()}
              />
            </View>
            <Text style={Styles.label}>Senha</Text>
            <View style={Styles.inputArea}>
              <TextInput
                ref="password"
                secureTextEntry={true}
                style={Styles.input}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                onFocus={() => this.refs.scroll.scrollTo({ x: 0, y: 70, animated: true })}
                onBlur={() => this.refs.scroll.scrollTo({ x: 0, y: 0, animated: true })}
                onSubmitEditing={event => this.refs.scroll.scrollTo({ x: 0, y: 0, animated: true })}
              />
            </View>
            <View style={Styles.row}>
              <TouchableOpacity color="#000" style={{ marginTop: 10 }} onPress={this.signup.bind(this)}>
                <Text>Cadastre-se</Text>
              </TouchableOpacity>
              <TouchableOpacity style={Styles.buttonOragen} color="#FFF" disabled={this.state.loading} onPress={this.login.bind(this)}>
                <Text style={Styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={Styles.buttonDark} onPress={() => this.facebookLogin()}>
              <Text style={Styles.buttonText}>Entrar com Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Constants.colors.blue
  },
  container: {
    height: height,
    justifyContent: 'flex-end'
  },
  logo: {
    width: 250,
    height: 248 / (658 / 250),
    marginVertical: 40,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  form: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFF'
  }
});

module.exports = Login;
