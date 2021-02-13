import app, { fb, firestore } from "./firebase";
import firebase from "firebase/app";

const users = firestore.collection("/catalyst-users");
const tickets = firestore.collection("/catalyst-ticket-counter");

const increment = fb.firestore.FieldValue.increment(1);

export async function getTicketNum() {
  let docSnapshot = await tickets.doc("globalTicketCount").get();
  return docSnapshot.data().num;
}

export async function incrementTicketCounter() {
  await tickets.doc("globalTicketCount").update({ num: increment });
  let currTicketNum = await getTicketNum();
  return currTicketNum;
}

export async function checkUser(userId) {
  let docSnapshot = await users.doc(userId).get();
  return docSnapshot.exists;
}

export async function getUser(userId) {
  let docSnapshot = await users.doc(userId).get();
  return {
    email: docSnapshot.data().email,
    name: `${docSnapshot.data().firstName} ${docSnapshot.data().lastName}`,
    ticketNumber: docSnapshot.data().ticketNum,
    username: docSnapshot.data().username
  };
}

export async function addUser(userId, userEmail, userfName, userlName, userName, userticketNum) {
  await users.doc(userId).set({
    email: userEmail,
    username: userName,
    firstName: userfName,
    lastName: userlName,
    ticketNum: userticketNum
  });
}

export async function registerUser(userEmail, userPass, userfName, userlName, userName, userticketNum) {
  let userCred = await app.auth().createUserWithEmailAndPassword(userEmail, userPass);
  let user = userCred.user;
  let userId = user.uid;

  try {
    await addUser(userId, userEmail, userfName, userlName, userName, userticketNum);
  } catch (e) {
    // If addUser doesn't work, delete the registered user from auth so they can retry
    await user.delete();
    await users.doc(userId)?.delete();
    throw new Error(e.message);
  }

  // Return the uid so that browser can save it in the cookie
  return userId;
}

export async function signInUser(email, password) {
  //await app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  await app.auth().signInWithEmailAndPassword(email, password);
}

export async function getCurrentUser() {
  let user = await app.auth().currentUser;
  return user;
}

export async function signOutUser() {
  let user = await getCurrentUser();
  if (user) {
    await app.auth().signOut();
  }
}
