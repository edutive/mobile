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

class Training extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      subject: this.props.navigation.state.params,
      questions: {},
      currentQuestion: 0
    };

    this.ref = null;
    this.questions = {};
    this.answers = [];
    this.interval = null;
  }

  componentWillMount() {
    this.ref = firebase.database().ref('questions');
    this.ref.orderByChild('subject').startAt(this.state.subject.id).on('value', this.handleQuestions.bind(this));
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

    this.setState({
      loading: false,
      questions: this.questions
    });
  }

  nextQuestion(answer) {
    this.answers.push({
      question: Object.keys(this.state.questions)[this.state.currentQuestion],
      answer: answer,
      correct: answer === this.state.questions[Object.keys(this.state.questions)[this.state.currentQuestion]].correctOption
    });

    if (Object.keys(this.state.questions)[this.state.currentQuestion + 1]) {
      this.setState({
        currentQuestion: ++this.state.currentQuestion
      });
    } else {
      Alert.alert('Treinamento', 'Você já respondeu todas as questões do treinamento.');
      this.goBack();
    }
  }

  goBack() {
    if (this.answers && this.answers.length > 0) {
      const ref = firebase.database().ref('trainings/' + global.USER.uid + '/' + this.state.subject.id).push({
        date: new Date().getTime(),
        answers: this.answers
      });

      this.props.navigation.navigate('Results', {
        training: ref.key,
        answers: this.answers
      });
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    const icons = [
      {
        name: 'question',
        value: `${this.state.currentQuestion + 1}/${this.state.questions ? Object.keys(this.state.questions).length : 0}`
      }
    ];

    const question =
      this.state.questions && Object.keys(this.state.questions) && Object.keys(this.state.questions)[this.state.currentQuestion]
        ? this.state.questions[Object.keys(this.state.questions)[this.state.currentQuestion]]
        : false;

    return (
      <View style={styles.container}>
        <IconBox title="Treinamento" onPress={() => {}} subjectIcon={this.state.subject.icon} icons={icons} />
        <View style={styles.iconRow}>
          <TouchableOpacity style={[Styles.buttonIcon, { marginRight: 16 }]} onPress={this.goBack.bind(this)}>
            <Icon color="#FFF" size={20} name="logout" />
            <Text style={Styles.buttonIconText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.question}>
            {question ? question.question : 'Carregando...'}
          </Text>
          <View style={styles.options}>
            <View style={styles.optionsRow}>
              <TouchableOpacity style={[Styles.buttonOragen, styles.option, { marginRight: 4 }]} onPress={this.nextQuestion.bind(this, 'a')}>
                <Text style={Styles.buttonText}>
                  {question ? question.option1 : '-'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[Styles.buttonOragen, styles.option, { marginLeft: 4 }]} onPress={this.nextQuestion.bind(this, 'b')}>
                <Text style={Styles.buttonText}>
                  {question ? question.option2 : '-'}
                </Text>
              </TouchableOpacity>
            </View>
            {question && question.option3
              ? <View style={styles.optionsRow}>
                  <TouchableOpacity style={[Styles.buttonOragen, styles.option, { marginRight: 4 }]} onPress={this.nextQuestion.bind(this, 'c')}>
                    <Text style={Styles.buttonText}>
                      {question ? question.option3 : '-'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Styles.buttonOragen, styles.option, { marginLeft: 4 }]} onPress={this.nextQuestion.bind(this, 'd')}>
                    <Text style={Styles.buttonText}>
                      {question ? question.option4 : '-'}
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

module.exports = Training;
