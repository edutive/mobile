import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

class NoContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.loading) {
      return <ActivityIndicator color={Constants.colors.yellow} size="large" style={{ marginTop: 20 }} />;
    } else if (!this.props.visible) {
      return null;
    } else {
      return (
        <View style={Styles.rowBox}>
          <View style={Styles.row}>
            <View>
              <Text style={Styles.rowBoxTitle}>
                {this.props.title}
              </Text>
              <View style={Styles.rowBoxContent}>
                <Text style={Styles.rowBoxContentTextNoMargin}>Fale com seus pofessores</Text>
              </View>
            </View>
            <Icon name="exclamation" size={40} color={Constants.colors.orangeIcon} />
          </View>
        </View>
      );
    }
  }
}

module.exports = NoContent;
