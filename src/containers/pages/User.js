import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
  ImageBackground,
  StatusBar,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import SafeAreaView from 'react-native-safe-area-view';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import oc from '../../assets/splash.png';

// import firebase from 'react-native-firebase';

export default class MyProfile extends Component {
  state = {
    userId: null,
    permissionsGranted: null,
    errorMessage: null,
    loading: false,
    updatesEnabled: false,
    location: {},
    photo_users: null,
    imageUri: null,
    imgSource: '',
    uploading: false,
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo_users');
    const userEmail = await AsyncStorage.getItem('user.email_users');
    // const Avatar = await Database.ref('users/' + userId + '/photo_users');
    this.setState({userId, userName, userAvatar, userEmail});
  };

  handleLogout = async () => {
    await AsyncStorage.getItem('userid')
      .then(async userid => {
        firebase.database().ref('users/' + userid).update({status: 'Offline'});
        firebase.auth().signOut();
        ToastAndroid.show('Logout success', ToastAndroid.LONG);
        // this.props.navigation.navigate('Out');
        this.props.navigation.navigate('SplashScreen');
      })
      .catch(error => this.setState({errorMessage: error.message}));
    // Alert.alert('Error Message', this.state.errorMessage);
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  changeImage = async type => {
    // console.log(upp)
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    let cameraPermission =
      (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    if (!cameraPermission) {
      cameraPermission = await this.requestCameraPermission();
    } else {
      ImagePicker.showImagePicker(options, response => {
        ToastAndroid.show(
          'Rest asure, your photo is flying to the shiny cloud',
          ToastAndroid.LONG,
        );
        let uploadBob = null;
        const imageRef = firebase
          .storage()
          .ref('photo_users/' + this.state.userId)
          .child('photo_users');
        fs.readFile(response.path, 'base64')
          .then(data => {
            return Blob.build(data, {type: `${response.mime};BASE64`});
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, {contentType: `${response.mime}`});
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            ToastAndroid.show(
              'Your cool avatar is being uploaded, its going back to your phone now',
              ToastAndroid.LONG,
            );
            firebase
              .database()
              .ref('users/' + this.state.userId)
              .update({photo_users: url});
            this.setState({userAvatar: url});
            AsyncStorage.setItem('user.photo_users', this.state.userAvatar);
          })

          .catch(err => console.log(err));
      });
    }
  };

  render() {
    const {uploading} = this.state;

    return (
      <SafeAreaView
        style={(styles.container, {backgroundColor: '#E5EDF9', flex: 1})}>
        <StatusBar translucent backgroundColor="transparent" />
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              paddingTop: 60,
              flex: 1,
              flexDirection: 'column',
              backgroundColor: '#7C80EE',
              height: 160,
              justifyContent: 'flex-end',
              borderBottomStartRadius: 140,
              borderBottomEndRadius: 140,
            }}>
            <ImageBackground
              resizeMode="contain"
              style={{
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={{
                uri: uploading.userAvatar,
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={this.changeImage}>
                <Image
                  source={{uri: this.state.userAvatar}}
                  style={{
                    backgroundColor: 'white',
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    borderColor: '#E5E7E9',
                    borderWidth: 2,
                    bottom: -60,
                  }}
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View
            style={{
              marginTop: 80,
              marginHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 32,
                color: '#7C80EE',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}>
              {this.state.userName}
            </Text>
          <View style={{
                backgroundColor: '#7C80EE',
                borderRadius:10,
                marginTop:10
              }} >  
            <Text style={{fontSize: 18,top:-2, color:'#fff', marginHorizontal:10}}>
                {this.state.userEmail} 
            </Text>
          </View>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                marginTop:60
               
              }}
              onPress={this.handleLogout}>
              <Text style={{fontSize: 18,  marginHorizontal:10,top:-2,color: 'white'}}> Logout </Text>
            </TouchableOpacity>

            <View style={styles.separator} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  separator: {
    height: 2,
    backgroundColor: '#eeeeee',
    marginTop: 10,
    marginHorizontal: 10,
  },
  bigseparator: {
    height: 10,
    backgroundColor: '#eeeeee',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#7C80EE',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  logoutContainer: {
    marginHorizontal: 30,
  },
  btnTxt: {
    color: '#fff',
  },
  image: {
    marginTop: 20,
    minWidth: 200,
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#ccc',
  },
  img: {
    flex: 1,
    height: 100,
    margin: 5,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#ccc',
  },
  progressBar: {
    backgroundColor: 'rgb(3, 154, 229)',
    height: 3,
    shadowColor: '#000',
  },
  btn: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    backgroundColor: 'rgb(3, 154, 229)',
    marginTop: 20,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: 'rgba(3,155,229,0.5)',
  },
});
