import app, { firestore } from "./firebase";

const users = firestore.collection("/catalyst-users");
const tickets = firestore.collection("/catalyst-ticket-counter")
const increment = firestore.FieldValue.increment(1);


export async function getTicketNum(){
    return tickets.doc('globalTicketCount').data().num;
}

export async function incrementTicketCounter(){
    tickets.doc('globalTicketCount').update({ num: increment });
    return getTicketNum();
}

export async function checkUser(userId){
    users.doc(userId).get()
        .then((docSnapshot) => {
            return docSnapshot.exists;
        });

    return false;
}

export async function addUser(userId, userEmail, userfName, userlName, userticketNum){
    users.doc(userId).set({
        email: userEmail,
        firstName: userfName,
        lastName: userlName,
        ticketNum: userticketNum
    })
    .catch((error) => {
        throw new Error(`Error ${error.code}: ${error.message}`);
      });;
}

export async function registerUser(userId, userEmail, userPass, userfName, userlName, userticketNum){
    app.auth().createUserWithEmailAndPassword(userEmail, userPass)
     .then(() => {
        addUser(userId, userEmail, userfName, userlName, userticketNum)
      })
      .catch((error) => {
        throw new Error(`Error ${error.code}: ${error.message}`);
      });
}
