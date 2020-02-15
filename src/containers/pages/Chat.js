import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, StatusBar} from 'react-native';
import {Container} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import {Database} from '../../config/initialize';
import {withNavigation} from 'react-navigation';
import firebase from 'react-native-firebase';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';

export default class ChatRoom extends Component {
  state = {
    message: '',
    messageList: [],
    person: this.props.navigation.getParam('item'),
    personid: this.props.navigation.getParam('item').uid_users,
    userId: AsyncStorage.getItem('userid'),
    userName: AsyncStorage.getItem('user.name'),
    userAvatar: AsyncStorage.getItem('user.photo_users'),
  };

  onSend = async () => {
    if (this.state.message.length > 0) {
      let msgId = Database.ref('messages')
        .child(this.state.userId)
        .child(this.state.personid)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        users: {
          _id: this.state.userId,
          name: this.state.userName,
          avatar: this.state.userAvatar,
        },
      };
      updates[
        'messages/' +
          this.state.userId +
          '/' +
          this.state.personid +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.personid +
          '/' +
          this.state.userId +
          '/' +
          msgId
      ] = message;
      Database.ref().update(updates);
      this.setState({message: ''});
    }
  };

  onSend = async () => {
    if (this.state.message.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(this.state.userId)
        .child(this.state.personid)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.userId,
          name: this.state.userName,
          avatar: this.state.userAvatar,
        },
      };
      updates[
        'messages/' +
          this.state.userId +
          '/' +
          this.state.personid +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.personid +
          '/' +
          this.state.userId +
          '/' +
          msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({message: ''});
    }
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo_users');
    this.setState({userId, userName, userAvatar});
    firebase
      .database()
      .ref('messages')
      .child(this.state.userId)
      .child(this.state.personid)
      .on('child_added', val => {
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, val.val()),
        }));
      });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: '#757EE3',
          },
          left: {
            color: '#fff',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#757EE3',
          },
          right: {
            backgroundColor: '#fff',
          },
        }}
        timeTextStyle={{
          right: {color: '#757EE3'},
          left: {color: '#ddd'},
        }}
      />
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{borderColor: 'white'}}>
          <Icon name="send" size={20} color="#847FE5" />
        </View>
      </Send>
    );
  }

  renderInputToolbar(props) {
    //Add the extra styles via containerStyle
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          borderTopColor: '#847FE5',
          borderTopWidth: 1,
          backgroundColor: 'white',
          marginHorizontal: 25,
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
        }}
        placeholder="Send your message..."
      />
    );
  }

  render() {
    // const {userName} = this.state;
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#7C80EE" />
        <View style={{flex: 1}}>
          <View style={{height: 80,marginTop:20, backgroundColor: '#7C80EE'}}>
            <View
              style={{
                marginLeft: 10,
                marginTop: 1,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={{
                  uri: this.props.navigation.getParam('item').photo_users,
                }}
                style={{
                  height: 60,
                  width: 60,
                  backgroundColor: '#ddd',
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: '#A2A7C0',
                  top: 10,
                }}
              />
              <View style={{marginLeft: 10, top: 8, flex: 1}}>
                <Text style={{fontSize: 22, color: '#fff'}}>
                  {this.props.navigation.getParam('item').username}
                </Text>
                <Text style={{fontSize: 16, color: '#fff'}}>
                  {this.props.navigation.getParam('item').email_users}
                </Text>
              </View>
              <View style={{left: -10, top: 5}}>
                <Text style={{fontSize: 16, color: '#fff'}}>
                  {this.props.navigation.getParam('item').status}
                </Text>
              </View>

              <View />
            </View>
          </View>

          <View style={{backgroundColor: '#E5EDF9', flex: 1}}>
            <GiftedChat
              renderSend={this.renderSend}
              renderInputToolbar={this.renderInputToolbar}
              renderBubble={this.renderBubble}
              text={this.state.message}
              onInputTextChanged={val => {
                this.setState({message: val});
              }}
              messages={this.state.messageList}
              onSend={() => this.onSend()}
              user={{
                _id: this.state.userId,
              }}
            />
          </View>
          {/* <FooterSend /> */}
        </View>
      </>
    );
  }
}
