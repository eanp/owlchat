import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

function SplashScreen(props) {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Login');
    }, 2000);
  }, [props.navigation]);

  return (
    <View style={styles.main}>
      <Text>SplashScreen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default SplashScreen;
