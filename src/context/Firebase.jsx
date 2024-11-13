import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, onValue } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_IREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [groupData, setGroupData] = useState([]);

  //to get the group data and userdetails
  useEffect(() => {
    onValue(ref(database, "groups"), (snapshot) => {
      const data = snapshot.val();

      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        setGroupData(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error("Failed to parse group data:", error);
        setGroupData([]);
      }
    });

    onValue(ref(database, "users"), (snapshot) => {
      const data = snapshot.val();
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        setUsers(parsedData);
      } catch (error) {
        console.error("Failed to parse group data:", error);
        setUsers([]);
      }
    });
  }, []);

  //to send the group data
  function setDatafirebase(key, data) {
    console.log(data, key, "key");
    return set(ref(database, key), data);
  }

  //to signup the user with email and password
  function signupUserWithEmailAndPassword(email, password) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // On successful signup, return the user data
        console.log("User created successfully:", userCredential.user);
        return userCredential.user;
      })
      .catch((err) => console.log(err));
  }

  //to signin the user
  // function signinUserWithEmailAndPassword(email, password) {
  //   return signInWithEmailAndPassword(firebaseAuth, email, password)
  //     .then((userCredential) => {
  //       console.log(userCredential);
  //       return userCredential.user;
  //     })
  //     .catch((err) => console.log(err, "hii"));
  // }

  function signinUserWithEmailAndPassword(email, password) {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        return userCredential.user;
      })
      .catch((err) => {
        // console.error("Error during sign-in:", err.message, err.code); // Better error message
        throw err; // Re-throw to handle in calling function
      });
  }

  //to add user details in the database
  function userDetails(key, data) {
    return set(ref(database, key), data);
  }

  console.log(groupData, "context", typeof groupData);

  return (
    <FirebaseContext.Provider
      value={{
        users,
        groupData,
        setDatafirebase,
        signupUserWithEmailAndPassword,
        signinUserWithEmailAndPassword,
        userDetails,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
