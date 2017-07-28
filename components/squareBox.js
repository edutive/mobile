import React from 'react';
import { AppRegistry, TouchableOpacity, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

class SquareBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={[
          Styles.squareBox,
          this.props.right ? { marginRight: 8 } : { marginLeft: 8 }
        ]}
        onPress={this.props.onPress.bind(this)}
      >
        <Text style={Styles.squareBoxTitle}>
          {this.props.title}
        </Text>
        <View style={Styles.squareBoxRow}>
          <View style={Styles.squareBoxContent}>
            <Icon
              name={this.props.smallIcon}
              size={20}
              color={Constants.colors.blue}
            />
            <Text style={Styles.squareBoxContentText}>
              {this.props.label}
            </Text>
          </View>
          <Icon
            name={this.props.icon}
            size={40}
            color={Constants.colors.orangeIcon}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

module.exports = SquareBox;
