import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth()
    .signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignIn : true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch (err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () =>{
    firebase.auth()
    .signOut()
    .then(res =>{
      const signOutUser = {
        isSignIn: false,
        name: '',
        photo: '',
        email: ''
      }
      setUser(signOutUser);
    })
    console.log ('sign out')
  }



  return (
    <div className="App">
      {user.isSignIn ? <button onClick ={handleSignOut}> Sign out</button> : <button onClick ={handleSignIn}> Sign in</button>

        }
      {
        user.isSignIn && <div>
          <p>Welcome {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src = {user.photo} alt =""/>
          </div>
      }
     
    </div>
  );
}

export default App;
