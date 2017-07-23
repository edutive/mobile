import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

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

    return (
      <TouchableOpacity style={Styles.rowBox} onPress={this.openSubject.bind(this, subject)}>
        <View style={Styles.row}>
          <View>
            <Text style={Styles.rowBoxTitle}>
              {subject.name}
            </Text>
            <View style={Styles.rowBoxContent}>
              <Icon name="people" size={18} color={Constants.colors.blue} />
              <Text style={Styles.rowBoxContentText}>0</Text>
              <Icon name="question" size={18} color={Constants.colors.blue} />
              <Text style={Styles.rowBoxContentText}>0</Text>
              <Icon name="envelope-open" size={18} color={Constants.colors.blue} />
              <Text style={Styles.rowBoxContentText}>0</Text>
            </View>
          </View>
          <Icon name={subject.icon} size={40} color={Constants.colors.orangeIcon} />
        </View>
      </TouchableOpacity>
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
