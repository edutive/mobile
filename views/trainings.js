import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import NoContent from '../components/noContent';

class Training extends React.Component {
  static navigationOptions = {
    title: 'Treinamentos',
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
      trainings: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.trainings = [];
  }

  componentWillMount() {
    this.ref = firebase.database().ref('trainings');
    this.ref
      .orderByChild('user')
      .equalTo(global.USER.uid)
      .on('value', this.handleTrainings.bind(this));
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleTrainings.bind(this));
    }
  }

  handleTrainings(snapshop) {
    this.trainings = snapshop.val() || [];

    this.setState({
      loading: false,
      trainings: this.listView.cloneWithRows(this.trainings)
    });
  }

  renderTraining(training) {
    if (!training || (this.state.subject && this.state.subject.id !== training.subject))
      return null;

    return (
      <TouchableOpacity style={Styles.rowBox}>
        <View style={Styles.row}>
          <View>
            <Text style={Styles.rowBoxTitle}>
              {training.name}
            </Text>
            <View style={Styles.rowBoxContent}>
              <Text style={Styles.rowBoxContentTextNoMargin}>
                {this.state.subjects[training.subject]
                  ? this.state.subjects[training.subject].name
                  : '-'}
              </Text>
            </View>
          </View>
          {this.state.subjects[training.subject]
            ? <Icon
                name={this.state.subjects[training.subject].icon}
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
        <NoContent title="Nenhum treinamento encontrado" visible={this.trainings.length === 0} />
        <ListView
          enableEmptySections={true}
          dataSource={this.state.trainings}
          renderRow={this.renderTraining.bind(this)}
        />
      </View>
    );
  }
}

module.exports = Training;
