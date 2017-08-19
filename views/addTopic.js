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

class AddTopic extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Novo Tópico',
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      subject: this.props.navigation.state.params.subject,
      category: this.props.navigation.state.params.category
    };
  }

  save() {
    const ref = firebase.database().ref('topics').child(this.state.category.id).push();
    newChatKey = ref.key;

    ref.set({
      id: ref.key,
      name: this.state.message,
      user: global.USER.uid
    });

    firebase.database().ref('subjects/' + this.state.subject.id).once('value', subjectSnapshop => {
      firebase.database().ref('subjects/' + this.state.subject.id + '/forum').set(subjectSnapshop.val().forum + 1);
    });

    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.sendArea}>
          <View style={[Styles.inputArea, styles.inputArea]}>
            <TextInput
              placeholder="Digite o nome"
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

module.exports = AddTopic;
