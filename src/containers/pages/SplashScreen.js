import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import oc from '../../assets/splash.png';
import {Auth} from '../../config/initialize';
import firebase from 'react-native-firebase';

function SplashScreen(props) {
  const {currentUser} = firebase.auth();

  useEffect(() => {
    setTimeout(() => {
      if (currentUser === null) {
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('MainScreen');
      }
    }, 3000);
  }, [currentUser, props.navigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E5EDF9" />
      <View style={styles.main}>
        <View>
          <Image source={oc} style={styles.oc} />
        </View>
        <Text style={styles.textsplash}>Chat from Owl People</Text>
        <View style={styles.box}>
          <Text style={styles.textbox}>OwlChat</Text>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#E5EDF9',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  box: {
    backgroundColor: '#7C80EE',
    marginTop: 35,
    height: 50,
    width: 160,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textbox: {
    color: '#E2E3FB',
    fontSize: 28,
    fontWeight: 'bold',
  },
  oc: {
    height: 150,
    width: 150,
    borderRadius: 30,
    borderWidth: 8,
    borderColor: '#F8A5A5',
    marginTop: 80,
  },
  textsplash: {
    color: '#7D7FA2',
    marginTop: 180,
    fontSize: 20,
  },
});

export default SplashScreen;
