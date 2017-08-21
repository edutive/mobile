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
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import moment from 'moment';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

const { width, height } = Dimensions.get('window');

class Message extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: state.params.user.firstname + ' ' + state.params.user.lastname,
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle
    };
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      message: '',
      viewWidth: width,
      viewHeight: height,
      user: this.props.navigation.state.params.user,
      chat: this.props.navigation.state.params.chat,
      messages: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.messages = {};
  }

  componentWillMount() {
    this.ref = firebase.database().ref('messages/' + this.state.chat.chat);
    this.ref.on('value', this.handleMessages.bind(this));

    Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');

    if (this.ref) {
      this.ref.off('value', this.handleMessages.bind(this));
    }
  }

  handleMessages(snapshop) {
    const messages = snapshop.val() || {};

    Object.keys(messages).sort().forEach(key => {
      this.messages[key] = messages[key];
    });

    this.setState({
      loading: false,
      messages: this.listView.cloneWithRows(this.messages)
    });
  }

  keyboardWillShow(e) {
    const newSize = Dimensions.get('window').height - e.endCoordinates.height;

    this.setState({
      viewHeight: newSize
    });
  }

  keyboardWillHide(e) {
    this.setState({
      viewHeight: Dimensions.get('window').height
    });
  }

  sendMessage() {
    firebase.database().ref('messages/' + this.state.chat.chat + '/' + new Date().getTime()).set({
      date: new Date().getTime(),
      sender: global.USER.uid,
      text: this.state.message
    });

    firebase.database().ref('chats/' + global.USER.uid + '/' + this.state.chat.chat + '/lastMessage').set(this.state.message);

    firebase.database().ref('chats/' + this.state.chat.user + '/' + this.state.chat.chat + '/lastMessage').set(this.state.message);

    this.setState({
      message: ''
    });
  }

  renderMessages(message) {
    if (!message) return null;

    const date = moment.unix(message.date / 1000).fromNow();

    return (
      <View style={[styles.box, global.USER.uid === message.sender && styles.fromMe, global.USER.uid !== message.sender && styles.toMe]}>
        <View style={[global.USER.uid === message.sender && styles.rowBoxFromMe, global.USER.uid !== message.sender && styles.rowBoxToMe]}>
          <Text style={[global.USER.uid === message.sender && styles.dateFromMe, { color: Constants.colors.blue }]}>
            {message.text}
          </Text>
        </View>
        <Text style={[styles.date, global.USER.uid === message.sender && styles.dateFromMe]}>
          {date}
        </Text>
      </View>
    );
  }

  render() {
    const height = this.state.viewHeight - (Platform.OS === 'ios' ? 62 : 80);

    return (
      <View style={{ height: height }}>
        <ListView
          ref="listView"
          style={{ marginBottom: 62 }}
          enableEmptySections={true}
          onContentSizeChange={() => this.refs.listView.scrollToEnd({ animated: true })}
          dataSource={this.state.messages}
          renderRow={this.renderMessages.bind(this)}
        />
        <View style={styles.sendArea}>
          <View style={[Styles.inputArea, styles.inputArea]}>
            <TextInput
              placeholder="Digite sua mensagem"
              style={Styles.input}
              underlineColorAndroid="transparent"
              onChangeText={message => this.setState({ message })}
              value={this.state.message}
              onFocus={() => this.refs.listView.scrollToEnd({ animated: true })}
              underlineColorAndroid="transparent"
              onSubmitEditing={this.sendMessage.bind(this)}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={this.sendMessage.bind(this)}>
            <Icon name="paper-plane" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    marginVertical: 8,
    marginHorizontal: 16
  },
  rowBoxFromMe: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 40,
    backgroundColor: Constants.colors.yellow
  },
  rowBoxToMe: {
    padding: 10,
    borderRadius: 8,
    marginRight: 40,
    backgroundColor: '#FFF'
  },
  fromMe: {
    alignSelf: 'flex-end'
  },
  toMe: {
    alignSelf: 'flex-start'
  },
  date: {
    fontSize: 10,
    marginTop: 3
  },
  dateFromMe: {
    textAlign: 'right'
  },
  sendArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    flexDirection: 'row',
    elevation: 2
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

module.exports = Message;
