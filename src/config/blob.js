// import ImagePicker,{showImagePicker} from 'react-native-image-picker';
// import RNFetchBlob,{constuploadUri} from 'react-native-fetch-blob';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   Keyboard,
//   Alert,
//   Platform,
//   PermissionsAndroid,
//   ToastAndroid,
//   StatusBar,
// } from 'react-native';
// import firebase from 'firebase';

// const Blob = RNFetchBlob.polyfill.Blob;
// const fs = RNFetchBlob.fs;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

// showImagePicker(response => {
//   if (!response.didCancel) {
//     uploadImage(response.uri);
//   }
// });

// export const uploadImage = (uri, mime = 'application/octet-stream') => {
//   return dispatch => {
//     return new Promise((resolve, reject) => {
//       constuploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
//       const sessionId = new Date().getTime();
//       let uploadBlob = null;
//       ///create a reference in firebase storage for the file
//       const imageRef = firebase
//         .storage()
//         .ref('/photo_users/')
//         .child('photo_users');
//       //encode data base64 unutk upload
//       fs.readFile(uploadUri, 'base64')
//         .then(data => {
//           return Blob.build(data, {type: `${mime};BASE64`});
//         })
//         ////place the blob into storage ref
//         .then(blob => {
//           uploadBlob = blob;
//           return imageRef.put(blob, {contentType: mime});
//         })

//         .then(() => {
//           resolve(url);

//           storeReference(url, sessionId);
//         })
//         .catch(error => {
//           reject(error);
//         });
//     });
//   };
// };

// const storeReference = (downloadUrl, sessionId) => {
//   let imageRef = firebase
//     .storage()
//     .ref('/photo_users/')
//     .child('photo_users');
//   let currentUser = firebase.auth().currentUser;
//   let image = {
//     type: 'image',
//     url: downloadUrl,
//     createdAt: sessionId,
//     user: {
//       id: currentUser.uid,
//       email: currentUser.email,
//     },
//   };
//   firebase
//     .database()
//     .ref()
//     .push(image);
// };

// ////////////////////////////////////////////////////////////////////////////////////

// changeImage = async type => {
//   let upp = type == 'header' ? 'header' : 'photo';
//   // console.log(upp)
//   const Blob = RNFetchBlob.polyfill.Blob;
//   const fs = RNFetchBlob.fs;
//   window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
//   window.Blob = Blob;

//   const options = {
//     title: 'Select Avatar',
//     storageOptions: {
//       skipBackup: true,
//       path: 'images',
//     },
//     mediaType: 'photo',
//   };

//   let cameraPermission =
//     (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
//     PermissionsAndroid.check(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//     ) &&
//     PermissionsAndroid.check(
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//     );
//   if (!cameraPermission) {
//     cameraPermission = await this.requestCameraPermission();
//   } else {
//     ImagePicker.showImagePicker(options, response => {
//       let uploadBob = null;
//       const imageRef = firebase
//         .storage()
//         .ref('photo_users/' + this.state.userId)
//         .child('photo_users');
//       fs.readFile(response.path, 'base64')
//         .then(data => {
//           return Blob.build(data, {type: `${response.mime};BASE64`});
//         })
//         .then(blob => {
//           uploadBob = blob;
//           return imageRef.put(blob, {contentType: `${response.mime}`});
//         })
//         .then(() => {
//           uploadBob.close();
//           return imageRef.getDownloadURL();
//         })
//         .then(url => {
//           upp == 'header'
//             ? firebase
//                 .database()
//                 .ref('users/' + this.state.uid)
//                 .update({header: url})
//             : firebase
//                 .database()
//                 .ref('users/' + this.state.uid)
//                 .update({photo: url});
//         })
//         .catch(err => console.log(err));
//     });
//   }
// };
