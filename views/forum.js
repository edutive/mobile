import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View, Dimensions, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import NoContent from '../components/noContent';
import SquareBox from '../components/squareBox';

const { width, height } = Dimensions.get('screen');

class Forum extends React.Component {
  static navigationOptions = {
    title: 'Fórum',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      subject: this.props.navigation.state.params,
      forums: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.forums = [];
  }

  componentWillMount() {
    this.ref = firebase.database().ref('categories/' + this.state.subject.id);
    this.ref.on('value', this.handleForums.bind(this));
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleForums.bind(this));
    }
  }

  handleForums(snapshop) {
    this.forums = snapshop.val() || [];

    this.setState({
      loading: false,
      forums: this.listView.cloneWithRows(this.forums)
    });
  }

  openForum(forum) {
    this.props.navigation.navigate('ForumCategory', {
      subject: this.state.subject,
      forum: forum
    });
  }

  renderForum(forum, section, rowID) {
    if (!forum) return null;

    return (
      <View style={{ width: width / 2 }}>
        <SquareBox onPress={this.openForum.bind(this, forum)} title={forum.name} right={rowID % 2 === 0} icon={forum.icon} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NoContent title="Nenhum fórum encontrado" visible={this.forums.length === 0} />
        <ListView
          contentContainerStyle={styles.list}
          enableEmptySections={true}
          dataSource={this.state.forums}
          renderRow={this.renderForum.bind(this)}
        />
        {/* <View
          style={{
            position: 'absolute',
            width: width,
            height: height - 80,
            paddingRight: 16,
            justifyContent: 'flex-end',
            alignItems: 'flex-end'
          }}
        >
          <TouchableOpacity style={Styles.buttonCircle}>
            <Icon name="note" size={20} color="#FFF" />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

module.exports = Forum;
