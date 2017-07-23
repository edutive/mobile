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

import UserBox from '../components/userBox';

const { width, height } = Dimensions.get('window');

class AddChat extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Nova mensagem',
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
      search: '',
      viewWidth: width,
      viewHeight: height,
      users: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.users = {};
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleUsers.bind(this));
    }
  }

  handleUsers(snapshop) {
    this.users = snapshop.val() || {};

    Object.keys(this.users).forEach(user => {
      if (user === global.USER.uid) {
        delete this.users[user];
      }
    });

    this.setState({
      loading: false,
      users: this.listView.cloneWithRows(this.users)
    });
  }

  search() {
    this.ref = firebase
      .database()
      .ref('users/')
      .orderByChild('firstname')
      .startAt(this.state.search);
    this.ref.once('value', this.handleUsers.bind(this));
  }

  openMessage(user, key) {
    firebase
      .database()
      .ref('chats/' + global.USER.uid)
      .orderByChild('user')
      .startAt(key)
      .once('value', snapshop => {
        let newChatKey = null;

        if (!snapshop.val()) {
          const messageId = new Date().getTime();

          const ref = firebase.database().ref('chats').child(global.USER.uid).push();
          newChatKey = ref.key;

          ref.set({
            chat: newChatKey,
            message: messageId,
            user: key
          });

          const senderChat = {};
          senderChat[newChatKey] = {
            chat: newChatKey,
            message: messageId,
            user: global.USER.uid
          };

          firebase.database().ref('chats').child(key).set(senderChat);
        }

        this.props.navigation.navigate('Message', {
          chat: snapshop.val()
            ? snapshop.val()[Object.keys(snapshop.val())[0]]
            : { chat: newChatKey, user: key },
          user: user
        });
      });
  }

  renderUser(user, section, index) {
    if (!user) return null;

    return <UserBox user={user} onPress={this.openMessage.bind(this, user, index)} />;
  }

  render() {
    const height = this.state.viewHeight - (Platform.OS === 'ios' ? 62 : 80);

    return (
      <View style={{ height: height }}>
        <View style={styles.sendArea}>
          <View style={[Styles.inputArea, styles.inputArea]}>
            <TextInput
              placeholder="Procurar usuário"
              style={Styles.input}
              onChangeText={message => this.setState({ message })}
              value={this.state.message}
              onFocus={() => this.refs.listView.scrollToEnd({ animated: true })}
              underlineColorAndroid="transparent"
              onSubmitEditing={this.search.bind(this)}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={this.search.bind(this)}>
            <Icon name="magnifier" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <ListView
          ref="listView"
          style={{ marginBottom: 62 }}
          enableEmptySections={true}
          onContentSizeChange={() => this.refs.listView.scrollToEnd({ animated: true })}
          dataSource={this.state.users}
          renderRow={this.renderUser.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    marginVertical: 8,
    marginHorizontal: 16
  },
  rowBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: Constants.colors.yellow
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

module.exports = AddChat;
