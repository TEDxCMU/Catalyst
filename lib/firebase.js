import firebase from "firebase/app";
import * as admin from 'firebase-admin';
import "firebase/auth";
import "firebase/firestore";


const serviceAccount = {
    // TODO: put json file contents in here in here, but put the values in env file first!
    // "type":
    // "project_id":
    // "private_key_id":
    // "private_key":
    // ""client_email""
    // etc
    //
    
}

export default !admin.apps.length ? admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tedxcmu-firebase.firebaseio.com"
  }) : admin.app();

export const fb = admin;

export const firestore = admin.firestore();

// OLD CODE - delete when we k admin works
// const config = {
//     apiKey: process.env.REACT_APP_API_KEY,
//     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_DATABASE_URL,
//     projectId: process.env.REACT_APP_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_APP_ID,
// };
// export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

// export const fb = firebase;

// export const firestore = firebase.firestore();
