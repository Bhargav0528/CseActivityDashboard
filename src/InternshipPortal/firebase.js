import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyAOJWL9pr3f5dhVD9be1UbiOWLe2g1h1es",
    authDomain: "fir-1-54605.firebaseapp.com",
    databaseURL: "https://fir-1-54605.firebaseio.com",
    projectId: "fir-1-54605",
    storageBucket: "fir-1-54605.appspot.com",
    messagingSenderId: "510992597765",
    appId: "1:510992597765:web:4f8e698d259d115d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;