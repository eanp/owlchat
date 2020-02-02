import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import oc from '../../assets/splash.png';
import {Database, Auth} from '../../config/initialize';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await this.getLocation();
  };

  componentWillUnmount() {
    this._isMounted = false;
    Geolocation.clearWatch();
    Geolocation.stopObserving();
  }
  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };
  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
        },
        error => {
          this.setState({errorMessage: error});
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 8000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  clearState() {
    this.setState({
      email: '',
      password: '',
    });
  }

  async authentication() {
    try {
      const responseFirebase = await Auth.signInWithEmailAndPassword(
        this.state.email,
        this.state.password,
      );
      await this.clearState();
      if (responseFirebase) {
        await this.setState({
          isLoading: false,
        });
        // await Database.ref('/users/' + responseFirebase.user.uid).once(
        //   'value',
        //   result => {
        //     let data = result.val();
        //     if (data !== null) {
        //       let user = Object.values(data);
        //       AsyncStorage.setItem('user.email_users', user[0].email_users);
        //       AsyncStorage.setItem('user.name', user[0].username);
        //       AsyncStorage.setItem('user.photo_users', user[0].photo_users);
        //     }
        //   },
        // );
        
        await Database.ref('/users/')
        .on('value', result => {
          let data = result.val();
          if (data !== null) {
            let user = Object.values(data);
            AsyncStorage.setItem('user.email_users', user[0].email_users);
              AsyncStorage.setItem('user.name', user[0].username);
              AsyncStorage.setItem('user.photo_users', user[0].photo_users);
          }
        });

        await Database.ref('/users/' + responseFirebase.user.uid).update({
          status: 'Online',
          latitude: this.state.latitude || null,
          longitude: this.state.longitude || null,
        });
        await AsyncStorage.setItem('userid', responseFirebase.user.uid);
        // await AsyncStorage.setItem('user', responseFirebase.user);
        ToastAndroid.show('Login success', ToastAndroid.LONG);
        await this.props.navigation.navigate('AppStack');
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
        'Unauthorized',
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

  async onSubmit() {
    await Keyboard.dismiss();
    await this.setState({
      isLoading: true,
    });
    await this.authentication();
  }

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>owlchat</Text>
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
          onChangeText={value =>
            this.setState({
              password: value,
            })
          }
          value={this.state.password}
          style={styles.textInput}
          theme={{
            colors: {primary: '#757EE3', underlineColor: 'transparent'},
          }}
        />
        <TouchableOpacity onPress={event => this.onSubmit(event)}>
          <View style={styles.box}>
            <Text style={styles.textbox}>Login</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Signup')}>
          <Text style={styles.textsplash}>
            Don't have Account? Register Here
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#E5EDF9',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    marginLeft: 16,
    fontSize: 42,
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
    marginTop: 70,
    fontSize: 18,
  },
  oc: {
    height: 150,
    width: 150,
    borderRadius: 30,
    borderWidth: 8,
    borderColor: '#F8A5A5',
    marginTop: 5,
    marginBottom: 40,
  },
  logos: {},
  title: {
    marginTop: 30,
    fontSize: 32,
    color: '#7C80EE',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});
