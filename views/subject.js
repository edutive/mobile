import React from 'react';
import {
  AppRegistry,
  TouchableOpacity,
  Text,
  ListView,
  Alert,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import SquareBox from '../components/squareBox';

class Subject extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle
  });

  constructor(props) {
    super(props);

    this.state = {
      subject: this.props.navigation.state.params
    };
  }

  openPage(page) {
    this.props.navigation.navigate(page, this.state.subject);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={Styles.row2}>
          <SquareBox
            title="Quizes"
            smallIcon="check"
            icon="question"
            label="7/10"
            right={true}
            onPress={this.openPage.bind(this, 'Quizes')}
          />
          <SquareBox
            title="Resultados"
            smallIcon="graph"
            icon="chart"
            label="80%"
            onPress={this.openPage.bind(this, 'Results')}
          />
        </View>
        <View style={Styles.row2}>
          <SquareBox
            title="Treinamentos"
            smallIcon="badge"
            icon="speedometer"
            label="7/10"
            right={true}
            onPress={this.openPage.bind(this, 'Trainings')}
          />
          <SquareBox
            title="Fórum"
            smallIcon="envelope-letter"
            icon="envelope-open"
            label="5"
            onPress={this.openPage.bind(this, 'Forum')}
          />
        </View>
      </View>
    );
  }
}

module.exports = Subject;
