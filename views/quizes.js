import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

class Quizes extends React.Component {
  static navigationOptions = {
    title: 'Quizes',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle,
    tabBarIcon: ({ tintColor }) => <Icon name="question" size={20} color={tintColor} />
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      subjects: {},
      quizes: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.quizes = {};
  }

  componentWillMount() {
    this.ref = firebase.database().ref('quizes');
    this.ref
      .orderByChild('user')
      .equalTo(global.USER.uid)
      .on('value', this.handleQuizes.bind(this));
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleQuizes.bind(this));
    }
  }

  handleQuizes(snapshop) {
    this.quizes = snapshop.val() || {};

    this.quizes.forEach(quiz => {
      if (quiz) {
        if (!this.state.subjects[quiz.subject]) {
          firebase.database().ref('subjects/' + quiz.subject).once('value', subjectSnap => {
            const subjects = this.state.subjects;
            subjects[quiz.subject] = subjectSnap.val();

            this.setState({
              subjects: subjects
            });
          });
        }
      }
    });

    this.setState({
      loading: false,
      quizes: this.listView.cloneWithRows(this.quizes)
    });
  }

  renderQuiz(quiz) {
    if (!quiz) return null;

    return (
      <TouchableOpacity style={Styles.rowBox}>
        <View style={Styles.row}>
          <View>
            <Text style={Styles.rowBoxTitle}>
              {quiz.name}
            </Text>
            <View style={Styles.rowBoxContent}>
              <Text style={Styles.rowBoxContentTextNoMargin}>
                {this.state.subjects[quiz.subject] ? this.state.subjects[quiz.subject].name : '-'}
              </Text>
            </View>
          </View>
          {this.state.subjects[quiz.subject]
            ? <Icon
                name={this.state.subjects[quiz.subject].icon}
                size={40}
                color={Constants.colors.orangeIcon}
              />
            : null}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.quizes}
          renderRow={this.renderQuiz.bind(this)}
        />
      </View>
    );
  }
}

module.exports = Quizes;
