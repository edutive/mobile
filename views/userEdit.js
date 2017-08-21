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

class UserEdit extends React.Component {
  static navigationOptions = {
    title: 'Editar Perfil',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle
  };

  constructor(props) {
    super(props);

    const user = this.props.navigation.state.params;

    this.state = {
      uid: user.uid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      photo: user.picture
    };

    this.updatedPhoto = false;
  }

  login() {
    this.props.navigation.goBack();
  }

  signup() {
    if (this.state.firstname && this.state.lastname) {
      if (this.updatedPhoto) {
        firebase
          .storage()
          .ref('/files/' + this.state.uid)
          .putFile(this.state.photo.uri, {
            contentType: 'image/jpeg'
          })
          .then(uploadedFile => {
            this.registerCallback(uploadedFile.downloadUrl);
          })
          .catch(err => {
            console.log('Upload Error', err);
            Alert.alert('Imagem', 'Não foi possível enviar sua imagem.');
          });
      } else {
        this.registerCallback(undefined);
      }
    } else {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos');
    }
  }

  registerCallback(pictureUrl) {
    global.USER = {
      uid: this.state.uid,
      email: this.state.email,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      picture: pictureUrl
    };

    firebase.database().ref('users').child(this.state.uid).set(global.USER);

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
        takePhotoButtonTitle: 'Tirar foto...',
        chooseFromLibraryButtonTitle: 'Escolher da biblioteca...',
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
          this.updatedPhoto = true;

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
      <KeyboardAvoidingView behavior="padding">
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
              underlineColorAndroid="transparent"
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
              underlineColorAndroid="transparent"
              onChangeText={lastname => this.setState({ lastname })}
              value={this.state.lastname}
            />
          </View>
          <View style={Styles.row}>
            <TouchableOpacity style={Styles.buttonOragen} color="#FFF" disabled={this.state.loading} onPress={this.signup.bind(this)}>
              <Text style={Styles.buttonText}>Atualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  }
});

module.exports = UserEdit;
