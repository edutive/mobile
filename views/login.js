import React from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';

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
    const user = firebase.auth().currentUser;

    if (user) {
      global.USER = user._user;

      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })]
      });

      this.props.navigation.dispatch(resetAction);
    }
  }

  signup() {
    this.props.navigation.navigate('SignUp');
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Home' })]
        });

        this.props.navigation.dispatch(resetAction);
      })
      .catch(error => {
        Alert.alert('Error', 'Não foi possível realizar o login, verifique seu e-mail e senha');
      });
  }

  facebookLogin() {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      result => {
        console.log(result);
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          alert('Login success with permissions: ' + result.grantedPermissions.toString());

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
              <TouchableOpacity
                color="#000"
                style={{ marginTop: 10 }}
                onPress={this.signup.bind(this)}
              >
                <Text>Cadastre-se</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.buttonOragen}
                color="#FFF"
                disabled={this.state.loading}
                onPress={this.login.bind(this)}
              >
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
