import firebase from 'firebase';

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: 'AIzaSyCVpnLO5264Oo0dchfvCD4LXEglthMIf54',
        authDomain: 'owlc-ea244.firebaseapp.com',
        databaseURL: 'https://owlc-ea244.firebaseio.com',
        projectId: 'owlc-ea244',
        storageBucket: 'owlc-ea244.appspot.com',
        messagingSenderId: '468351993817',
        appId: '1:468351993817:web:6440a1b449c513b4c17bc8',
      });
    }
  }

  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({message}) {
        console.log('Failed:' + message);
      }
    } else {
      console.log('Reusing auth...');
    }
  };

  createAccount = async user => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        function() {
          var userf = firebase.auth().currentUser;
          userf.updateProfile({displayName: user.name}).then(
            function() {
              alert('User ' + user.name + ' was created successfully.');
            },
            function(error) {
              console.warn('Error update displayName.');
            },
          );
        },
        function(error) {
          console.error('got error:' + error.message);
          alert('Create account failed.');
        },
      );
  };

  uploadImage = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref('avatar');
      const task = ref.put(blob);
      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {},
          reject,
          resolve(task.snapshot.downloadURL),
        );
      });
    } catch (err) {
      console.log('uploadImage error: ' + err.message);
    }
  };

  updateAvatar = url => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({avatar: url}).then(
        function() {
          console.log('Updated avatar successfully. url:' + url);
          alert('Avatar image is saved successfully.');
        },
        function(error) {
          console.warn('Error update avatar.');
          alert('Error update avatar. Error:' + error.message);
        },
      );
    } else {
      console.log("can't update avatar, user is not login.");
      alert('Unable to update avatar. You must login first.');
    }
  };

  onLogout = user => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('Sign-out successful.');
      })
      .catch(function(error) {
        console.log('An error happened when signing out');
      });
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages');
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
  };

  parse = snapshot => {
    const {timestamp: numberStamp, text, user} = snapshot.val();
    const {key: _id} = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {_id, timestamp, text, user};
    return message;
  };

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
 

  refOff() {
    this.ref.off();
  }
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
