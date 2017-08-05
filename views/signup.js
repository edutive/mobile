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
  Alert,
  Image,
  AsyncStorage
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import ImagePicker from 'react-native-image-picker';

import firebase from '../firebase';

import Constants from '../contants';
import Styles from '../styles';

import UserPicture from '../components/userPicture';

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
      password: '',
      photo: null
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
            if (this.state.photo) {
              firebase
                .storage()
                .ref('/files/' + user.uid)
                .putFile(this.state.photo.uri, {
                  contentType: 'image/jpeg'
                })
                .then(uploadedFile => {
                  this.registerCallback(user, uploadedFile.downloadUrl);
                })
                .catch(err => {
                  console.log('Upload Error', err);
                  Alert.alert('Imagem', 'Não foi possível enviar sua imagem.');
                });
            } else {
              this.registerCallback(user, undefined);
            }
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

  registerCallback(user, pictureUrl) {
    global.USER = {
      uid: user.uid,
      email: this.state.email,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      picture: pictureUrl
    };

    firebase.database().ref('users').child(user.uid).set(global.USER);

    AsyncStorage.setItem('user', JSON.stringify(global.USER), error => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })]
      });

      this.props.navigation.dispatch(resetAction);
    });
  }

  choosePhoto() {
    ImagePicker.showImagePicker(
      {
        title: 'Selecionar Foto',
        maxWidth: 200,
        maxHeight: 200,
        cameraType: 'front',
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let source = { uri: response.uri };

          this.setState({
            photo: source
          });
        }
      }
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.form}>
          <View style={[Styles.row, { marginBottom: 20 }]}>
            <UserPicture big={true} picture={this.state.photo} firstname={this.state.firstname} lastname={this.state.lastname} />
            <TouchableOpacity onPress={this.choosePhoto.bind(this)} style={[Styles.buttonOragen, { alignSelf: 'center' }]}>
              <Text style={Styles.buttonText}>Selecionar Foto</Text>
            </TouchableOpacity>
          </View>
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
            <TouchableOpacity color="#000" style={{ marginTop: 10 }} onPress={this.login.bind(this)}>
              <Text>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.buttonOragen} color="#FFF" disabled={this.state.loading} onPress={this.signup.bind(this)}>
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
