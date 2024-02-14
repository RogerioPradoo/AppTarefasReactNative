import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


let firebaseConfig = {
    apiKey: "AIzaSyDHz3uuB32d2LxHka3pwAQcfgepVvBs09I",
    authDomain: "tarefas-2816c.firebaseapp.com",
    projectId: "tarefas-2816c",
    storageBucket: "tarefas-2816c.appspot.com",
    messagingSenderId: "119287256428",
    appId: "1:119287256428:web:20a12f155ad6af20700f49",
    measurementId: "G-W74Q73Y6HG"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;