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
    if (
      this.state.firstname &&
      this.state.lastname &&
      this.state.email &&
      this.state.password
    ) {
      if (this.state.password.length >= 6) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(user => {
            global.USER = {
              uid: user.uid,
              email: this.state.email,
              firstname: this.state.firstname,
              lastname: this.state.lastname
            };

            firebase.database().ref('users').child(user.uid).set(global.USER);

            if (this.state.photo) {
              firebase
                .storage()
                .ref('/files/' + user.uid)
                .putFile(this.state.photo.uri, {
                  contentType: 'image/jpeg'
                })
                .then(uploadedFile => {
                  AsyncStorage.setItem(
                    'user',
                    JSON.stringify(global.USER),
                    error => {
                      const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'Home' })
                        ]
                      });

                      this.props.navigation.dispatch(resetAction);
                    }
                  );
                })
                .catch(err => {
                  console.log('Upload Error', err);
                  Alert.alert('Imagem', 'Não foi possível enviar sua imagem.');
                });
            }
          })
          .catch(error => {
            if (error.userInfo.error_name === 'ERROR_EMAIL_ALREADY_IN_USE') {
              Alert.alert(
                'E-mail',
                'Esse e-mail já foi utilizado por outro usuário'
              );
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

          console.log(source);

          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };

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
            <View style={styles.picture}>
              {this.state.photo
                ? <Image
                    source={this.state.photo}
                    style={styles.pictureImage}
                  />
                : <Text style={styles.pictureLabel}>
                    {this.state.firstname.length > 0
                      ? this.state.firstname.substr(0, 1).toUpperCase()
                      : '-'}
                    {this.state.lastname.length > 0
                      ? this.state.lastname.substr(0, 1).toUpperCase()
                      : '-'}
                  </Text>}
            </View>
            <TouchableOpacity
              onPress={this.choosePhoto.bind(this)}
              style={[Styles.buttonOragen, { alignSelf: 'center' }]}
            >
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
  },
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.colors.orange
  },
  pictureLabel: {
    fontSize: 30,
    color: '#FFF'
  },
  pictureImage: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
});

module.exports = SignUp;
