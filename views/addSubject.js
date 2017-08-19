import React from 'react';
import {
  AppRegistry,
  TouchableOpacity,
  Text,
  ListView,
  Alert,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import moment from 'moment';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

class AddSubject extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Adicionar Disciplina',
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      category: this.props.navigation.state.params
    };
  }

  save() {
    this.ref = firebase.database().ref('subjects/' + this.state.message);
    this.ref.once('value', subjectSnapshop => {
      if (subjectSnapshop.val()) {
        firebase.database().ref('students/' + global.USER.uid).once('value', subjects => {
          if (!subjects.val() || !subjects.val()[this.state.message]) {
            firebase.database().ref('subjects/' + this.state.message + '/students').set(subjectSnapshop.val().students + 1);
          }

          firebase.database().ref('students/' + global.USER.uid + '/' + this.state.message).set(true);
          this.props.navigation.goBack();
        });
      } else {
        Alert.alert('Disciplina', 'Disciplina não encontrada.');
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.sendArea}>
          <View style={[Styles.inputArea, styles.inputArea]}>
            <TextInput
              placeholder="Digite o código da disciplina"
              style={Styles.input}
              onChangeText={message => this.setState({ message })}
              value={this.state.message}
              underlineColorAndroid="transparent"
              onSubmitEditing={this.save.bind(this)}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={this.save.bind(this)}>
            <Icon name="add" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sendArea: {
    padding: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    flexDirection: 'row'
  },
  inputArea: {
    flex: 1,
    marginBottom: 0
  },
  sendButton: {
    backgroundColor: Constants.colors.orange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = AddSubject;
