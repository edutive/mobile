import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';
import UserBox from '../components/userBox';

import firebase from '../firebase';

import NoContent from '../components/noContent';

import ActionButton from 'react-native-action-button';

class ForumCategory extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle
  });

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      subject: this.props.navigation.state.params.subject,
      forum: this.props.navigation.state.params.forum,
      users: {},
      topics: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.topics = {};
  }

  componentDidMount() {
    this.ref = firebase.database().ref('topics/' + this.state.forum.id);
    this.ref.on('value', this.handleTopics.bind(this));
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleTopics.bind(this));
    }
  }

  handleTopics(snapshop) {
    this.topics = snapshop.val() || {};

    Object.keys(this.topics).forEach(key => {
      const topic = this.topics[key];

      if (topic) {
        if (!this.state.users[topic.user]) {
          firebase.database().ref('users/' + topic.user).once('value', userSnap => {
            const users = this.state.users;
            users[topic.user] = userSnap.val();

            this.setState({
              users: users
            });
          });
        }
      }
    });

    this.setState({
      loading: false,
      topics: this.listView.cloneWithRows(this.topics)
    });
  }

  addTopic() {
    this.props.navigation.navigate('AddTopic', {
      subject: this.state.subject,
      category: this.state.forum
    });
  }

  openMessage(topic) {
    if (this.state.users[topic.user]) {
      this.props.navigation.navigate('ForumTopic', {
        topic: topic,
        user: this.state.users[topic.user]
      });
    }
  }

  renderMessages(topic) {
    if (!topic) return null;

    return (
      <UserBox user={this.state.users[topic.user]} description={topic.name} descriptionIcon="envelope" onPress={this.openMessage.bind(this, topic)} />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NoContent title="Nenhum tópico encontrado" visible={Object.keys(this.topics).length === 0} />
        <ListView enableEmptySections={true} dataSource={this.state.topics} renderRow={this.renderMessages.bind(this)} />
        <ActionButton buttonColor={Constants.colors.orange} onPress={this.addTopic.bind(this)} />
      </View>
    );
  }
}

module.exports = ForumCategory;
