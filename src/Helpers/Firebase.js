// Import the functions you need from the SDKs you need
// import { firebase } from "firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// apiKey: "AIzaSyBAwbGNFsWrHe4Drad9hvLDhxeeTro4HCc",
// authDomain: "banglabazar-a5adb.firebaseapp.com",
// projectId: "banglabazar-a5adb",
// storageBucket: "banglabazar-a5adb.appspot.com",
// messagingSenderId: "340732495426",
// appId: "1:340732495426:web:524e63f582b05145a6cfdb",
// measurementId: "G-CYW5KSRJT5",
const firebaseConfig = {
  apiKey: "AIzaSyDq0Uv0QUvd8pB-xYjyuLh6pnMUtj6u8AY",
  authDomain: "bangla-bazar-4c5d5.firebaseapp.com",
  projectId: "bangla-bazar-4c5d5",
  storageBucket: "bangla-bazar-4c5d5.appspot.com",
  messagingSenderId: "847040027463",
  appId: "1:847040027463:web:2215bfcfb09c53fc7c8a62",
  measurementId: "G-LZ2BSYCWW6",
};
firebase.initializeApp(firebaseConfig);
export const firestore_db = firebase.firestore();
export default firebase;
