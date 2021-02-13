import app, { fb, firestore } from './firebase';

const users = firestore.collection('/catalyst-users');
const tickets = firestore.collection('/catalyst-ticket-counter');

const increment = fb.firestore.FieldValue.increment(1);

export async function getTicketNum() {
  let docSnapshot = await tickets.doc('globalTicketCount').get();
  return docSnapshot.data().num;
}

export async function incrementTicketCounter() {
  await tickets.doc('globalTicketCount').update({ num: increment });
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
    username: docSnapshot.data().username,
  };
}

export async function addUser(
  userId,
  userEmail,
  userfName,
  userlName,
  userName,
  userticketNum
) {
  await users.doc(userId).set({
    email: userEmail,
    username: userName,
    firstName: userfName,
    lastName: userlName,
    ticketNum: userticketNum,
  });
}

export async function signInUser(token) {
  await app.auth().signInWithCustomToken(token);
}

export async function signOutUser() {
  const user = getCurrentUser();
  if (user) {
    await app.auth().signOut();
  }
}

export function getCurrentUser() {
  return app.auth().currentUser;
}

export async function getCurrentUserToken() {
  return await app.auth().currentUser?.getIdToken();
}
