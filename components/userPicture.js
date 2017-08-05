import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Constants from '../contants';

class UserPicture extends React.Component {
  render() {
    return (
      <View style={[styles.picture, this.props.big && styles.big]}>
        {this.props.picture
          ? <Image source={this.props.picture.uri ? this.props.picture : { uri: this.props.picture }} style={styles.pictureImage} />
          : <Text style={[styles.pictureLabel, this.props.big && { fontSize: 30 }]}>
              {this.props.firstname ? this.props.firstname.substr(0, 1).toUpperCase() : '-'}
              {this.props.lastname ? this.props.lastname.substr(0, 1).toUpperCase() : '-'}
            </Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.colors.orange
  },
  pictureLabel: {
    fontSize: 16,
    color: '#FFF'
  },
  pictureImage: {
    borderWidth: 1,
    borderColor: '#FFF',
    width: 44,
    height: 44,
    borderRadius: 22
  },
  big: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2
  }
});

module.exports = UserPicture;
