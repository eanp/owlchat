// import firebase from 'firebase';

// var firebaseConfig = {
//   apiKey: 'AIzaSyAnwn2uuRVh_mC3PH8dTxtl1GsC4OhrLP4',
//   authDomain: 'owlchat-94f62.firebaseapp.com',
//   databaseURL: 'https://owlchat-94f62.firebaseio.com',
//   projectId: 'owlchat-94f62',
//   storageBucket: 'owlchat-94f62.appspot.com',
//   messagingSenderId: '349515904716',
//   appId: '1:349515904716:web:b5f435620a064e6bc5f469',
//   measurementId: 'G-WE9H2G0ET1',
// };

// let app = firebase.initializeApp(firebaseConfig);

// export const Database = app.database();
// export const Auth = app.auth();

const firebase = require('react-native-firebase');

module.exports = {
  firebase,
  Database: () => firebase.database(),
  Auth: () => firebase.auth(),
};
