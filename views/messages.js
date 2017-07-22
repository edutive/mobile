import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

class Messages extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Mensagens',
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle,
      tabBarIcon: ({ tintColor }) => <Icon name="bubbles" size={20} color={tintColor} />,
      headerRight:
        state && state.params && state.params.renderHeaderRight && state.params.renderHeaderRight()
    };
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
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

    this.chats.forEach(chat => {
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

  addMessage() {}

  renderQuiz(chat) {
    if (!chat) return null;

    return (
      <TouchableOpacity style={Styles.rowBox}>
        <View style={Styles.row2}>
          <View style={Styles.rowBoxPicture}>
            <Text style={Styles.rowBoxPictureLabel}>
              {this.state.users[chat.user]
                ? this.state.users[chat.user].firstname.substr(0, 1).toUpperCase() +
                  this.state.users[chat.user].lastname.substr(0, 1).toUpperCase()
                : '-'}
            </Text>
          </View>
          <View>
            <Text style={Styles.rowBoxTitle}>
              {this.state.users[chat.user]
                ? `${this.state.users[chat.user].firstname} ${this.state.users[chat.user].lastname}`
                : '-'}
            </Text>
            <View style={Styles.rowBoxContent}>
              <Icon name="speech" size={18} color={Constants.colors.blue} />
              <Text style={Styles.rowBoxContentText}>
                {chat.lastMessage}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.chats}
          renderRow={this.renderQuiz.bind(this)}
        />
      </View>
    );
  }
}

module.exports = Messages;
