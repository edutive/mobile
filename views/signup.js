import React from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import firebase from '../firebase';

import Constants from '../contants';
import Styles from '../styles';

class SignUp extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    };
  }

  login() {
    this.props.navigation.goBack();
  }

  signup() {
    if (this.state.firstname && this.state.lastname && this.state.email && this.state.password) {
      if (this.state.password.length >= 6) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(user => {
            firebase.database().ref('users').child(user.uid).set({
              firstname: this.state.firstname,
              lastname: this.state.lastname
            });

            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Home' })]
            });

            this.props.navigation.dispatch(resetAction);
          })
          .catch(error => {
            if (error.userInfo.error_name === 'ERROR_EMAIL_ALREADY_IN_USE') {
              Alert.alert('E-mail', 'Esse e-mail já foi utilizado por outro usuário');
            }
            console.log(error.userInfo);
          });
      } else {
        Alert.alert('Senha', 'Sua senha deve ter 6 digitos ou mais');
      }
    } else {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos');
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.form}>
          <Text style={Styles.label}>Nome</Text>
          <View style={Styles.inputArea}>
            <TextInput
              autoCapitalize="none"
              style={Styles.input}
              onChangeText={firstname => this.setState({ firstname })}
              value={this.state.firstname}
              onSubmitEditing={() => this.refs.lastname.focus()}
            />
          </View>
          <Text style={Styles.label}>Sobrenome</Text>
          <View style={Styles.inputArea}>
            <TextInput
              ref="lastname"
              autoCapitalize="none"
              style={Styles.input}
              onChangeText={lastname => this.setState({ lastname })}
              value={this.state.lastname}
              onSubmitEditing={() => this.refs.email.focus()}
            />
          </View>
          <Text style={Styles.label}>E-mail</Text>
          <View style={Styles.inputArea}>
            <TextInput
              ref="email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={Styles.input}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
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
            />
          </View>
          <View style={Styles.row}>
            <TouchableOpacity
              color="#000"
              style={{ marginTop: 10 }}
              onPress={this.login.bind(this)}
            >
              <Text>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.buttonOragen}
              color="#FFF"
              disabled={this.state.loading}
              onPress={this.signup.bind(this)}
            >
              <Text style={Styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Constants.colors.blue
  },
  form: {
    margin: 20,
    marginTop: 40,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFF'
  }
});

module.exports = SignUp;
