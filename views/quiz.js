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

import IconBox from '../components/iconBox';

function pad(val) {
  return val > 9 ? val : '0' + val;
}

let sec = 0;

class Quiz extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      quiz: this.props.navigation.state.params.quiz,
      subject: this.props.navigation.state.params.subject,
      questions: {},
      currentQuestion: 0,
      minutes: '00',
      seconds: '00',
      doubt: false
    };

    this.ref = null;
    this.questions = {};
    this.answers = [];
    this.interval = null;
  }

  componentWillMount() {
    this.ref = firebase
      .database()
      .ref('quizesQuestions/' + this.state.quiz.id)
      .on('value', this.handleQuestions.bind(this));
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleQuestions.bind(this));
    }

    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  handleQuestions(snapshop) {
    this.questions = snapshop.val() || {};

    this.getQuestion();

    this.setState({
      loading: false,
      questions: this.questions
    });
  }

  getQuestion() {
    firebase
      .database()
      .ref('questions/' + Object.keys(this.questions)[this.state.currentQuestion])
      .once('value', questionSnapshop => {
        this.questions[
          Object.keys(this.questions)[this.state.currentQuestion]
        ] = questionSnapshop.val();

        if (!this.interval) {
          this.interval = setInterval(() => {
            this.setState({
              minutes: pad(parseInt(sec / 60, 10)),
              seconds: pad(++sec % 60)
            });
          }, 1000);
        }

        this.setState({
          questions: this.questions
        });
      });
  }

  nextQuestion(answer) {
    this.answers.push({
      question: Object.keys(this.state.questions)[this.state.currentQuestion],
      answer: answer,
      correct:
        answer ===
        this.state.questions[Object.keys(this.state.questions)[this.state.currentQuestion]]
          .correctOption,
      doubt: this.state.doubt
    });

    if (this.state.currentQuestion < Object.keys(this.state.questions).length - 1) {
      this.setState({
        doubt: false,
        currentQuestion: ++this.state.currentQuestion
      });

      this.getQuestion();
    } else {
      firebase
        .database()
        .ref('results/' + global.USER.uid + '/' + this.state.quiz.id)
        .set(this.answers);

      this.props.navigation.navigate('Results', {
        quiz: this.state.quiz,
        answers: this.answers
      });
    }
  }

  render() {
    const icons = [
      {
        name: 'question',
        value: `${this.state.currentQuestion + 1}/${this.state.questions
          ? Object.keys(this.state.questions).length
          : 0}`
      },
      { name: 'clock', value: `${this.state.minutes}:${this.state.seconds}` }
    ];

    const question =
      this.state.questions &&
      Object.keys(this.state.questions) &&
      Object.keys(this.state.questions)[this.state.currentQuestion] &&
      this.state.questions[Object.keys(this.state.questions)[this.state.currentQuestion]] &&
      this.state.questions[Object.keys(this.state.questions)[this.state.currentQuestion]].title
        ? this.state.questions[Object.keys(this.state.questions)[this.state.currentQuestion]]
        : false;

    return (
      <View style={styles.container}>
        <IconBox
          title={this.state.quiz.name}
          onPress={() => {}}
          subjectIcon={this.state.subject.icon}
          icons={icons}
        />
        <View style={styles.iconRow}>
          <TouchableOpacity style={[Styles.buttonIcon, { marginRight: 16 }]}>
            <Icon color="#FFF" size={20} name="logout" />
            <Text style={Styles.buttonIconText}>Abandonar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.buttonIcon}
            onPress={() => this.setState({ doubt: !this.state.doubt })}
          >
            <Icon color="#FFF" size={20} name={this.state.doubt ? 'check' : 'flag'} />
            <Text style={Styles.buttonIconText}>Marcar como dúvida</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.question}>
            {question ? question.title : 'Carregando...'}
          </Text>
          <View style={styles.options}>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[Styles.buttonOragen, styles.option, { marginRight: 4 }]}
                onPress={this.nextQuestion.bind(this, 'a')}
              >
                <Text style={Styles.buttonText}>
                  {question ? question.options.a : '-'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.buttonOragen, styles.option, { marginLeft: 4 }]}
                onPress={this.nextQuestion.bind(this, 'b')}
              >
                <Text style={Styles.buttonText}>
                  {question ? question.options.b : '-'}
                </Text>
              </TouchableOpacity>
            </View>
            {question && question.options.c
              ? <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={[Styles.buttonOragen, styles.option, { marginRight: 4 }]}
                    onPress={this.nextQuestion.bind(this, 'c')}
                  >
                    <Text style={Styles.buttonText}>
                      {question ? question.options.c : '-'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[Styles.buttonOragen, styles.option, { marginLeft: 4 }]}
                    onPress={this.nextQuestion.bind(this, 'd')}
                  >
                    <Text style={Styles.buttonText}>
                      {question ? question.options.d : '-'}
                    </Text>
                  </TouchableOpacity>
                </View>
              : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Constants.colors.blue
  },
  iconRow: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: '#FFF',
    margin: 16,
    marginTop: 0,
    padding: 8,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  question: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center'
  },
  options: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  optionsRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  option: {
    flex: 1
  }
});

module.exports = Quiz;
