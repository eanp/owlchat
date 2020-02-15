import React from 'react';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-paper';
import oc from '../../assets/splash.png';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageEditor,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      photo_users: null,
      username: '',
      status: '',
      longitude: null,
      latitude: null,
      isLoading: false,
      isSubmit: false,
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.isSubmit !== this.state.isSubmit) {
      await this.setState({
        isLoading: false,
      });
      await this.register();
    }
  }

  async register() {
    try {
      await this.setState({
        isLoading: true,
        isAuth: true,
      });
      const responseFirebase = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      await this.clearState();
      if (responseFirebase) {
        const uid = await responseFirebase.user.uid;
        const email = await responseFirebase.user.email;
        await firebase
          .database()
          .ref('users/' + uid)
          .set({
            uid_users: uid,
            email_users: email,
            photo_users: '',
            username: this.state.username,
            status: 'offline',
            longitude: '',
            latitude: '',
          });
        await Alert.alert('Register Succes');
        await this.props.navigation.navigate('Login');
      } else {
        await this.setState({
          isLoading: false,
        });
        await Alert.alert(
          'Error',
          'Oops.. something error',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      }
    } catch ({message}) {
      await this.setState({
        isLoading: false,
      });
      Alert.alert(
        'Error',
        message,
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  }

  onSubmit() {
    Keyboard.dismiss();
    this.setState({
      isSubmit: true,
      isLoading: true,
    });
  }

  clearState() {
    this.setState({
      email: '',
      password: '',
    });
  }

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.titles}>owlchat</Text>
        <View style={styles.logos}>
          <Image source={oc} style={styles.oc} />
        </View>
        <TextInput
          label="Email"
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={value =>
            this.setState({
              email: value,
            })
          }
          style={styles.textInput}
          theme={{
            colors: {primary: '#757EE3', underlineColor: '#A2A7C0'},
          }}
        />
        <TextInput
          label="Password"
          secureTextEntry
          value={this.state.password}
          onChangeText={value =>
            this.setState({
              password: value,
            })
          }
          style={styles.textInput}
          theme={{
            colors: {primary: '#757EE3', underlineColor: 'transparent'},
          }}
        />
        <TextInput
          label="Username"
          value={this.state.username}
          onChangeText={value =>
            this.setState({
              username: value,
            })
          }
          style={styles.textInput}
          theme={{
            colors: {primary: '#757EE3', underlineColor: '#A2A7C0'},
          }}
        />
        <TouchableOpacity onPress={event => this.onSubmit(event)}>
          <View style={styles.box}>
            <Text style={styles.textbox}>Register</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.textsplash}>I have Account? Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const offset = 20;
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#E5EDF9',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  usernameInput: {
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
  logos: {},
  titles: {
    marginTop: 30,
    fontSize: 32,
    color: '#7C80EE',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  oc: {
    height: 150,
    width: 150,
    borderRadius: 30,
    borderWidth: 8,
    borderColor: '#F8A5A5',
    marginTop: 5,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#FFF',
    height: 50,
    marginTop: 15,
    color: '#eee',
    marginBottom: 5,
    fontSize: 12,
    width: 250,
  },
  box: {
    backgroundColor: '#7C80EE',
    marginTop: 20,
    height: 40,
    width: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textbox: {
    color: '#E2E3FB',
    fontWeight: 'bold',
    fontSize: 24,
  },
  textsplash: {
    color: '#7D7FA2',
    marginTop: 20,
    fontSize: 18,
  },
});
