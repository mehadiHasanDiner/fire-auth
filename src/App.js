import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// এটাও দেওয়া যায় error মুক্ত থাকতে (Extra Security জন্য এটা মেইন্টেইন করা হয়)
// if (!firebase.apps.length) {
//   try{
//     firebase.initializeApp(firebaseConfig);
//   } catch (err){
//     console.error("Firebase initialization error raised", err.stack)
//   }
// }

function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  // Sign in user function
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }


  // Sign out user function
  const handleSignOut = () => {
    firebase.auth()
      .signOut()
      .then(res => {
        const signOutUser = {
          inSignIn: false,
          name: '',
          photo: '',
          email: '',
          password: ''
        }
        setUser(signOutUser);
      })
    console.log('sign Out')
  }

  {/* step-2(v-2) {42} time: 7:00 */ }
  const handleSubmit = () => {

  }

  {/* step-2, 3(v-2, 3) {42} time: 8:03, 00:50 onChnage, onBlur*/ }
  const handleBlur = (e) => {
    // debugger;
    {/* step-3(v-4) {42} time: 2.47*/ }
    let isFormValid;
    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
      //[...card, newItem]
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;  
      setUser(newUserInfo);    
    }
  }



  return (
    <div className="App">
      {
        user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }

      {
        user.isSignIn && <div>
          <p>Welcome {user.name}!</p>
          <p>Your Email : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      {/* step-1(v-2) {42} */}
      <h1>Our Own Authentication</h1>
      <p>Name : {user.name}</p>
      <p>Email: {user.email} </p>
      <p>Password : {user.password}</p>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text"  onBlur={handleBlur} placeholder="Your Name"/>
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required />
        <br />
        <input type="password" id="" name="password" onBlur={handleBlur} placeholder="Your password" required />
        <br />
        <input type="submit" value="Submit" />
      </form>

    </div>
  );
}

export default App;
