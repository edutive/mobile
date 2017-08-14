import React from 'react';
import { AppRegistry, TouchableOpacity, Text, ListView, Alert, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Constants from '../contants';
import Styles from '../styles';

import firebase from '../firebase';

import IconBox from '../components/iconBox';
import NoContent from '../components/noContent';

class Subjects extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Disciplinas',
      headerTintColor: '#FFF',
      headerStyle: Styles.headerStyle,
      tabBarIcon: ({ tintColor }) => <Icon name="graduation" size={20} color={tintColor} />,
      headerRight: state && state.params && state.params.renderHeaderRight && state.params.renderHeaderRight()
    };
  };

  constructor(props) {
    super(props);

    this.listView = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      loading: true,
      subjects: this.listView.cloneWithRows({})
    };

    this.ref = null;
    this.subjects = {};
  }

  componentWillMount() {
    this.ref = firebase.database().ref('students/' + global.USER.uid);
    this.ref.on('value', this.handleSubjects.bind(this));

    if (!this.props.navigation.state.params) {
      this.props.navigation.setParams({
        renderHeaderRight: () =>
          <TouchableOpacity onPress={() => this.addSubject()}>
            <Icon name="plus" size={20} color="#FFF" style={{ marginRight: 16 }} />
          </TouchableOpacity>
      });
    }
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.handleSubjects.bind(this));
    }
  }

  addSubject() {
    this.props.navigation.navigate('AddSubject');
  }

  handleSubjects(snapshop) {
    const subjects = snapshop.val() || {};

    Object.keys(subjects).forEach(key => {
      firebase.database().ref('subjects/' + key).once('value', snapshopSubject => {
        this.subjects[key] = snapshopSubject.val();

        this.setState({
          loading: false,
          subjects: this.listView.cloneWithRows(this.subjects)
        });
      });
    });
  }

  openSubject(subject) {
    this.props.navigation.navigate('Subject', subject);
  }

  renderSubject(subject) {
    if (!subject) return null;

    const icons = [{ name: 'people', value: '0' }, { name: 'question', value: '0' }, { name: 'envelope-open', value: '0' }];

    return <IconBox title={subject.name} onPress={this.openSubject.bind(this, subject)} subjectIcon={subject.icon} icons={icons} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NoContent title="Nenhuma disciplina encontrada" loading={this.state.loading} visible={Object.keys(this.subjects).length === 0} />
        <ListView enableEmptySections={true} dataSource={this.state.subjects} renderRow={this.renderSubject.bind(this)} />
      </View>
    );
  }
}

module.exports = Subjects;
