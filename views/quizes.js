import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import NoContent from '../components/noContent';

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

    const subjects = {};
    if (this.props.navigation.state.params) {
      subjects[this.props.navigation.state.params.id] = this.props.navigation.state.params;
    }

    this.state = {
      loading: true,
      subject: this.props.navigation.state.params,
      subjects: subjects,
      quizes: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.quizes = {};
  }

  componentWillMount() {
    if (!this.state.subject) {
      firebase.database().ref('subjects').on('value', subjectSnap => {
        this.setState({
          subjects: subjectSnap.val()
        });

        this.loadAll();
      });
    } else {
      this.loadAll();
    }
  }

  loadAll() {
    firebase.database().ref('students/' + global.USER.uid).on('value', subjectSnap => {
      this.setState({
        student: subjectSnap.val()
      });

      this.ref = firebase.database().ref('quizes');
      this.ref.on('value', this.handleQuizes.bind(this));
    });
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleQuizes.bind(this));
    }
  }

  handleQuizes(snapshop) {
    const quizes = snapshop.val() || {};

    Object.keys(quizes).forEach(key => {
      const quiz = quizes[key];
      if (quiz) {
        if (this.state.subject) {
          if (this.state.student[quiz.subject] && quiz.subject === this.state.subject.id) {
            this.quizes[key] = quiz;
          }
        } else {
          if (this.state.student[quiz.subject]) {
            this.quizes[key] = quiz;
          }
        }
      }
    });

    this.setState({
      loading: false,
      quizes: this.listView.cloneWithRows(this.quizes)
    });
  }

  openQuiz(quiz) {
    this.props.navigation.navigate('Quiz', {
      quiz: quiz,
      subject: this.state.subjects[quiz.subject]
    });
  }

  renderQuiz(quiz) {
    if (!quiz || (this.state.subject && this.state.subject.id !== quiz.subject)) return null;

    return (
      <TouchableOpacity style={Styles.rowBox} onPress={this.openQuiz.bind(this, quiz)}>
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
            ? <Icon name={this.state.subjects[quiz.subject].icon} size={40} color={Constants.colors.orangeIcon} />
            : null}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NoContent title="Nenhum quiz encontrado" loading={this.state.loading} visible={Object.keys(this.quizes).length === 0} />
        <ListView enableEmptySections={true} dataSource={this.state.quizes} renderRow={this.renderQuiz.bind(this)} />
      </View>
    );
  }
}

module.exports = Quizes;
