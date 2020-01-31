import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat'; // 0.3.0
import {Text} from 'native-base';

import firebaseSDK from '../../config/firebaseSDK';

type Props = {
  name?: string,
  email?: string,
  avatar?: string,
};

export default class Chat extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    messages: [],
    name: '',
    email: '',
    avatar: '',
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: (
            <Text
              onPress={() => {
                alert('hello');
              }}
              style={{color: 'skyblue'}}>
              Hello developer
            </Text>
          ),
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar:
              'https://img.inews.id/media/822/files/inews_new/2019/11/15/budis1.jpg',
          },
        },
      ],
    });
  }

  get user() {
    return {
      name: this.state.name,
      email: this.state.email,
      avatar: this.state.avatar,
      id: firebaseSDK.uid,
      _id: firebaseSDK.uid,
    };
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSDK.send}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    firebaseSDK.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })),
    );
  }
  componentWillUnmount() {
    firebaseSDK.refOff();
  }
}
