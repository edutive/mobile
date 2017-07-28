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

class ForumTopic extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: state.params.topic.name,
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle
    };
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    const user = this.props.navigation.state.params.user;
    const users = {};
    users[user.id] = user;

    this.state = {
      message: '',
      viewWidth: width,
      viewHeight: height,
      users: users,
      user: user,
      topic: this.props.navigation.state.params.topic,
      forums: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.forums = {};
  }

  componentDidMount() {
    this.ref = firebase.database().ref('forums/' + this.state.topic.id);
    this.ref.on('value', this.handleMessages.bind(this));

    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardWillShow');
    Keyboard.removeListener('keyboardWillHide');

    if (this.ref) {
      this.ref.off('value', this.handleMessages.bind(this));
    }
  }

  handleMessages(snapshop) {
    const forums = snapshop.val() || {};

    Object.keys(forums).sort().forEach(key => {
      this.forums[key] = forums[key];

      if (this.forums[key]) {
        if (!this.state.users[this.forums[key].user]) {
          firebase
            .database()
            .ref('users/' + this.forums[key].user)
            .once('value', userSnap => {
              const users = this.state.users;
              users[this.forums[key].user] = userSnap.val();

              this.setState({
                users: users
              });
            });
        }
      }
    });

    this.setState({
      loading: false,
      forums: this.listView.cloneWithRows(this.forums)
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
    firebase
      .database()
      .ref('forums/' + this.state.topic.id + '/' + new Date().getTime())
      .set({
        date: new Date().getTime(),
        sender: global.USER.uid,
        text: this.state.message
      });

    this.setState({
      message: ''
    });
  }

  renderMessages(message) {
    if (!message) return null;

    const date = moment.unix(message.date / 1000).fromNow();

    return (
      <View style={[styles.box]}>
        <View style={[styles.rowBox]}>
          <View style={[Styles.row]}>
            <View>
              <Text style={[{ color: Constants.colors.blue }]}>
                {message.text}
              </Text>
              <Text style={[styles.date]}>
                {date}
              </Text>
            </View>

            <View style={Styles.rowBoxPicture}>
              <Text style={Styles.rowBoxPictureLabel}>
                {this.state.users[message.user]
                  ? this.state.users[message.user].firstname
                      .substr(0, 1)
                      .toUpperCase() +
                    this.state.users[message.user].lastname
                      .substr(0, 1)
                      .toUpperCase()
                  : '-'}
              </Text>
            </View>
          </View>
        </View>
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
          dataSource={this.state.forums}
          renderRow={this.renderMessages.bind(this)}
        />
        <View style={styles.sendArea}>
          <View style={[Styles.inputArea, styles.inputArea]}>
            <TextInput
              placeholder="Participe da discursão"
              style={Styles.input}
              multiline={true}
              onChangeText={message => this.setState({ message })}
              value={this.state.message}
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={this.sendMessage.bind(this)}
          >
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

module.exports = ForumTopic;
