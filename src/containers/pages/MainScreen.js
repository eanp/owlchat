import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

function MainScreen() {
  return (
    <View style={styles.main}>
      <Text>owlchat</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: 'salmon',
  },
});

export default MainScreen;
