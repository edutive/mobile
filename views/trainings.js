import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import IconBox from '../components/iconBox';
import NoContent from '../components/noContent';

class Training extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Treinamentos',
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle,
      headerRight: state && state.params && state.params.renderHeaderRight && state.params.renderHeaderRight()
    };
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      subject: this.props.navigation.state.params,
      trainings: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.trainings = [];
  }

  componentWillMount() {
    this.ref = firebase.database().ref('trainings/' + global.USER.uid + '/' + this.state.subject.id);
    this.ref.on('value', this.handleTrainings.bind(this));

    if (!this.props.navigation.state.params.renderHeaderRight) {
      this.props.navigation.setParams({
        renderHeaderRight: () =>
          <TouchableOpacity onPress={() => this.startTraining()}>
            <Icon name="plus" size={20} color="#FFF" style={{ marginRight: 16 }} />
          </TouchableOpacity>
      });
    }
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleTrainings.bind(this));
    }
  }

  startTraining() {
    this.props.navigation.navigate('Training', this.state.subject);
  }

  handleTrainings(snapshop) {
    this.trainings = snapshop.val() || [];

    this.setState({
      loading: false,
      trainings: this.listView.cloneWithRows(this.trainings)
    });
  }

  openTraining(training) {
    this.props.navigation.navigate('Results', training);
  }

  renderTraining(training) {
    if (!training) return null;

    const icons = [{ name: 'question', value: training.answers.length }];
    const date = moment.unix(training.date / 1000).fromNow();

    return <IconBox title={date} onPress={this.openTraining.bind(this, training)} subjectIcon={this.state.subject.icon} icons={icons} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NoContent title="Nenhum treinamento encontrado" visible={this.trainings.length === 0} />
        <ListView enableEmptySections={true} dataSource={this.state.trainings} renderRow={this.renderTraining.bind(this)} />
      </View>
    );
  }
}

module.exports = Training;
