import React from 'react';
import ImagePicker from 'react-native-image-picker';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ImageEditor,
  PermissionsAndroid,
} from 'react-native';

import firebaseSDK from '../../config/firebaseSDK';

export default class Signup extends React.Component {
  state = {
    name: 'no name',
    email: 'test@owlchat.com',
    password: '123456',
    avatar: '',
  };

  onPressCreate = async () => {
    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      };
      await firebaseSDK.createAccount(user);
    } catch ({message}) {
      console.log('create account failed. catch error:' + message);
    }
  };

  onChangeTextEmail = email => this.setState({email});
  onChangeTextPassword = password => this.setState({password});
  onChangeTextName = name => this.setState({name});

  onImageUpload = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    return (
      <View>
        <Text style={styles.title}>Email:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="test@live.com"
          onChangeText={this.onChangeTextEmail}
          value={this.state.email}
        />
        <Text style={styles.title}>Password:</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={this.onChangeTextPassword}
          value={this.state.password}
        />
        <Text style={styles.title}>Name:</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={this.onChangeTextName}
          value={this.state.name}
        />
        <Button
          title="Signup"
          style={styles.buttonText}
          onPress={this.onPressCreate}
        />
        <Button
          title="Upload Avatar"
          style={styles.buttonText}
          onPress={this.onImageUpload}
        />
      </View>
    );
  }
}

const offset = 20;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },
});
