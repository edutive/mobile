import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import IconBox from '../components/iconBox';

class Subjects extends React.Component {
  static navigationOptions = {
    title: 'Disciplinas',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle,
    tabBarIcon: ({ tintColor }) => <Icon name="graduation" size={20} color={tintColor} />
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      subjects: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.subjects = {};
  }

  componentWillMount() {
    this.ref = firebase.database().ref('subjects');

    this.ref
      .orderByChild('user')
      .equalTo(global.USER.uid)
      .on('value', this.handleSubjects.bind(this));
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleSubjects.bind(this));
    }
  }

  handleSubjects(snapshop) {
    this.subjects = snapshop.val() || {};

    this.setState({
      loading: false,
      subjects: this.listView.cloneWithRows(this.subjects)
    });
  }

  openSubject(subject) {
    this.props.navigation.navigate('Subject', subject);
  }

  renderSubject(subject) {
    if (!subject) return null;

    const icons = [
      { name: 'people', value: '0' },
      { name: 'question', value: '0' },
      { name: 'envelope-open', value: '0' }
    ];

    return (
      <IconBox
        title={subject.name}
        onPress={this.openSubject.bind(this, subject)}
        subjectIcon={subject.icon}
        icons={icons}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.subjects}
          renderRow={this.renderSubject.bind(this)}
        />
      </View>
    );
  }
}

module.exports = Subjects;
