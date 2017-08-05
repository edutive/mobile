import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';
import UserBox from '../components/userBox';

import firebase from '../firebase';

import NoContent from '../components/noContent';

class Messages extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Mensagens',
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle,
      tabBarIcon: ({ tintColor }) => <Icon name="bubbles" size={20} color={tintColor} />,
      headerRight: state && state.params && state.params.renderHeaderRight && state.params.renderHeaderRight()
    };
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      loading: true,
      users: {},
      chats: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.chats = {};
  }

  componentWillMount() {
    this.ref = firebase.database().ref('chats/' + global.USER.uid);
    this.ref.on('value', this.handleChats.bind(this));

    if (!this.props.navigation.state.params) {
      this.props.navigation.setParams({
        renderHeaderRight: () =>
          <TouchableOpacity onPress={() => this.addMessage()}>
            <Icon name="plus" size={20} color="#FFF" style={{ marginRight: 16 }} />
          </TouchableOpacity>
      });
    }
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleChats.bind(this));
    }
  }

  handleChats(snapshop) {
    this.chats = snapshop.val() || {};

    Object.keys(this.chats).forEach(key => {
      const chat = this.chats[key];

      if (chat) {
        if (!this.state.users[chat.user]) {
          firebase.database().ref('users/' + chat.user).once('value', userSnap => {
            const users = this.state.users;
            users[chat.user] = userSnap.val();

            this.setState({
              users: users
            });
          });
        }
      }
    });

    this.setState({
      loading: false,
      chats: this.listView.cloneWithRows(this.chats)
    });
  }

  addMessage() {
    this.props.navigation.navigate('AddChat');
  }

  openMessage(chat) {
    if (this.state.users[chat.user]) {
      this.props.navigation.navigate('Message', {
        chat: chat,
        user: this.state.users[chat.user]
      });
    }
  }

  renderMessages(chat) {
    if (!chat) return null;

    return (
      <UserBox
        user={this.state.users[chat.user]}
        description={chat.lastMessage}
        descriptionIcon="speech"
        onPress={this.openMessage.bind(this, chat)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NoContent title="Nenhuma mensagem encontrada" loading={this.state.loading} visible={Object.keys(this.chats).length === 0} />
        <ListView enableEmptySections={true} dataSource={this.state.chats} renderRow={this.renderMessages.bind(this)} />
      </View>
    );
  }
}

module.exports = Messages;
