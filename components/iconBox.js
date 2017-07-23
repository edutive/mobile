import React from 'react';
import { AppRegistry, TouchableOpacity, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

class IconBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity style={Styles.rowBox} onPress={this.props.onPress.bind(this)}>
        <View style={Styles.row}>
          <View>
            <Text style={Styles.rowBoxTitle}>
              {this.props.title}
            </Text>
            <View style={Styles.rowBoxContent}>
              {this.props.icons.map((icon, index) => {
                return (
                  <View style={Styles.row2} key={index}>
                    <Icon name={icon.name} size={18} color={Constants.colors.blue} />
                    <Text style={Styles.rowBoxContentText}>
                      {icon.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <Icon name={this.props.subjectIcon} size={40} color={Constants.colors.orangeIcon} />
        </View>
      </TouchableOpacity>
    );
  }
}

module.exports = IconBox;
