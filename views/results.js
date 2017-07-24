import React from 'react';
import {
  AppRegistry,
  Button,
  Text,
  TextInput,
  ListView,
  Alert,
  View,
  StyleSheet,
  AsyncStorage,
  Dimensions
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Svg, {
  G,
  Line,
  Path,
  Rect,
  Symbol,
  Defs,
  LinearGradient,
  Stop,
  Circle
} from 'react-native-svg';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as color from 'd3-color';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

const { width, height } = Dimensions.get('window');

class Results extends React.Component {
  static navigationOptions = {
    title: 'Resultados',
    headerTintColor: '#FFF',
    headerStyle: Styles.headerStyle
  };

  constructor(props) {
    super(props);

    this.state = {
      arc1: 0,
      arc2: 0
    };

    let increment = 0.01;

    this.interval = setInterval(() => {
      increment += 1;

      if (this.state.arc1 < 270) {
        this.setState({
          arc1: this.state.arc1 + Math.pow(1.05, increment),
          arc2: this.state.arc2 + Math.pow(1.05, increment)
        });
      } else {
        clearInterval(this.interval);
      }
    }, 10);
  }

  render() {
    const d3 = {
      scale,
      shape,
      color
    };

    var pi = Math.PI;

    var fullArc = d3.shape
      .arc()
      .innerRadius(50)
      .outerRadius(50)
      .startAngle(0)
      .endAngle(360 * (pi / 180))();

    const getArc = angle => {
      return d3.shape
        .arc()
        .innerRadius(50)
        .outerRadius(50)
        .startAngle(0)
        .endAngle(angle * (pi / 180))();
    };

    return (
      <View style={{ flex: 1 }}>
        <Svg style={{ width: width, height: 200 }}>
          <Path d={fullArc} x="100" y="100" strokeWidth="10" stroke="#CCC" />
          <Path
            d={getArc(this.state.arc1)}
            x="100"
            y="100"
            strokeLinejoin="round"
            strokeWidth="10"
            stroke={Constants.colors.orange}
          />

          <Path d={fullArc} x="250" y="100" strokeWidth="10" stroke="#CCC" />
          <Path
            d={getArc(this.state.arc2)}
            x="250"
            y="100"
            strokeLinejoin="round"
            strokeWidth="10"
            stroke={Constants.colors.pink}
          />
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

module.exports = Results;
