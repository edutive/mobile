import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

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
          <TouchableOpacity
            style={[Styles.squareBox, { marginRight: 8 }]}
            onPress={this.openPage.bind(this, 'Quizes')}
          >
            <Text style={Styles.squareBoxTitle}>Quizes</Text>
            <View style={Styles.squareBoxRow}>
              <View style={Styles.squareBoxContent}>
                <Icon name="check" size={20} color={Constants.colors.blue} />
                <Text style={Styles.squareBoxContentText}>7/10</Text>
              </View>
              <Icon name="question" size={40} color={Constants.colors.orangeIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Styles.squareBox, { marginLeft: 8 }]}
            onPress={this.openPage.bind(this, 'Results')}
          >
            <Text style={Styles.squareBoxTitle}>Resultados</Text>
            <View style={Styles.squareBoxRow}>
              <View style={Styles.squareBoxContent}>
                <Icon name="graph" size={20} color={Constants.colors.blue} />
                <Text style={Styles.squareBoxContentText}>80%</Text>
              </View>
              <Icon name="chart" size={40} color={Constants.colors.orangeIcon} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={Styles.row2}>
          <TouchableOpacity
            style={[Styles.squareBox, { marginTop: 0, marginRight: 8 }]}
            onPress={this.openPage.bind(this, 'Trainings')}
          >
            <Text style={Styles.squareBoxTitle}>Treinamentos</Text>
            <View style={Styles.squareBoxRow}>
              <View style={Styles.squareBoxContent}>
                <Icon name="badge" size={20} color={Constants.colors.blue} />
                <Text style={Styles.squareBoxContentText}>7/10</Text>
              </View>
              <Icon name="speedometer" size={40} color={Constants.colors.orangeIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[Styles.squareBox, { marginTop: 0, marginLeft: 8 }]}>
            <Text style={Styles.squareBoxTitle}>Fórum</Text>
            <View style={Styles.squareBoxRow}>
              <View style={Styles.squareBoxContent}>
                <Icon name="envelope-letter" size={20} color={Constants.colors.blue} />
                <Text style={Styles.squareBoxContentText}>5</Text>
              </View>
              <Icon name="envelope-open" size={40} color={Constants.colors.orangeIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

module.exports = Subject;
