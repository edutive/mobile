import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import Constants from './contants';

import Login from './views/login';
import SignUp from './views/signup';

import Quizes from './views/quizes';
import Quiz from './views/quiz';
import Results from './views/results';

import Subjects from './views/subjects';
import Subject from './views/subject';

import Messages from './views/messages';
import Message from './views/message';
import AddChat from './views/addChat';

import Profile from './views/profile';
import Trainings from './views/trainings';

import Forum from './views/forum';
import ForumCategory from './views/forumCategory';
import ForumTopic from './views/forumTopic';
import AddTopic from './views/addTopic';

import UserEdit from './views/userEdit';

global.USER = null;

const Home = TabNavigator(
  {
    QuizesTab: { screen: Quizes },
    SubjectsTab: { screen: Subjects },
    MessagesTab: { screen: Messages },
    ProfileTab: { screen: Profile }
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: Constants.colors.orange,
      inactiveTintColor: Constants.colors.blue,
      labelStyle: {
        fontSize: 14,
        marginBottom: 10
      },
      style: {
        height: 70,
        backgroundColor: 'white',
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2
        },
        shadowRadius: 5,
        shadowOpacity: 0.05
      }
    }
  }
);

const Edutive = StackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Home: { screen: Home },
  Subject: { screen: Subject },
  Quizes: { screen: Quizes },
  Quiz: { screen: Quiz },
  Trainings: { screen: Trainings },
  Message: { screen: Message },
  AddChat: { screen: AddChat },
  Results: { screen: Results },
  Forum: { screen: Forum },
  ForumCategory: { screen: ForumCategory },
  ForumTopic: { screen: ForumTopic },
  AddTopic: { screen: AddTopic },
  UserEdit: { screen: UserEdit }
});

AppRegistry.registerComponent('edutive', () => Edutive);
