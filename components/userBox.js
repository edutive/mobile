import React from 'react';
import { AppRegistry, TouchableOpacity, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

class UserBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity style={Styles.rowBox} onPress={this.props.onPress.bind(this)}>
        <View style={Styles.row2}>
          <View style={Styles.rowBoxPicture}>
            <Text style={Styles.rowBoxPictureLabel}>
              {this.props.user
                ? this.props.user.firstname.substr(0, 1).toUpperCase() +
                  this.props.user.lastname.substr(0, 1).toUpperCase()
                : '-'}
            </Text>
          </View>
          <View>
            <Text style={Styles.rowBoxTitle}>
              {this.props.user ? `${this.props.user.firstname} ${this.props.user.lastname}` : '-'}
            </Text>
            {this.props.description
              ? <View style={Styles.rowBoxContent}>
                  <Icon name={this.props.descriptionIcon} size={18} color={Constants.colors.blue} />
                  <Text style={Styles.rowBoxContentText}>
                    {this.props.description}
                  </Text>
                </View>
              : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

module.exports = UserBox;
