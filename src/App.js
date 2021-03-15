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
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    newUser: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();


  // Sign in user function
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(googleProvider)
      .then(res => {
        const { displayName, photoURL, email, password } = res.user;
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          password: password,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email, password);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const handleFbSignIn = () => {
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log ('fb user after sign in', user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
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
          password: '',
          error: '',
          success: false,
        }
        setUser(signOutUser);
      })
    console.log('sign Out')
  }


  {/* step-2, 3(v-2, 3) {42} time: 8:03, 00:50 onChnage, onBlur*/ }
  const handleBlur = (e) => {
    // debugger;
    {/* step-3(v-4) {42} time: 2.47*/ }
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      //[...card, newItem]
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  // const handleChange = (e) => {    
  //   console.log(e.target.name, e.target.value);
  // }

  {/* step-2(v-2) {42} time: 7:00 */ }
  {/* step-4(v-5) {42} time: 5:00 */ }
  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then( res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
          console.log('sign in user info', res.user);
        })
        .catch((error) => {
          const newUserInfo ={...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);       
        });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
            newUserInfo.error = '';
            newUserInfo.success = true;
            setUser(newUserInfo);
    })
    .catch(function(error) {
      const newUserInfo ={...user};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            setUser(newUserInfo); 
    });
  
    }
    e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log('user name updated successfully')
    }).catch(function(error) {
      console.log(error)
    });
  }



  return (
    <div className="App">
      {
        user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick ={handleFbSignIn}>Sign in using Facebook</button>
      {
        user.isSignIn && <div>
          <p>Welcome {user.name}!</p>
          <p>Your Email : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      {/* step-1(v-2) {42} */}
      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange ={() =>setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign up</label>

      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your Name" />}
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required />
        <br />
        <input type="password" id="" name="password" onBlur={handleBlur} placeholder="Your password" required />
        <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style ={{color:'red'}}>{user.error}</p>
      {user.success && <p style ={{color:'green'}}>User {newUser?'Created' : 'Logged In'} Successfully</p>}
    </div>
  );
}

export default App;
