import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Constants from '../contants';

class UserPicture extends React.Component {
  render() {
    return (
      <View style={styles.picture}>
        {this.props.picture
          ? <Image
              source={
                this.props.picture.uri
                  ? this.props.picture
                  : { uri: this.props.picture }
              }
              style={styles.pictureImage}
            />
          : <Text style={styles.pictureLabel}>
              {this.props.firstname
                ? this.props.firstname.substr(0, 1).toUpperCase()
                : '-'}
              {this.props.lastname
                ? this.props.lastname.substr(0, 1).toUpperCase()
                : '-'}
            </Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.colors.orange
  },
  pictureLabel: {
    fontSize: 30,
    color: '#FFF'
  },
  pictureImage: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    width: 100,
    height: 100,
    borderRadius: 50
  }
});

module.exports = UserPicture;
