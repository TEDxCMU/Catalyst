import app, { fb, firestore } from "./firebase";

const users = firestore.collection("/catalyst-users");
const tickets = firestore.collection("/catalyst-ticket-counter");
const increment = fb.firestore.FieldValue.increment(1);


export async function getTicketNum(){
    console.log("getTicketNum - before get");
    let docSnapshot;
    try {
        console.log("getTicketNum - try block");
        docSnapshot = await tickets.doc('globalTicketCount').get();
    } catch (e) {
        console.log("getTicketNum - catch block");
        throw new Error(e.message);
    }
    console.log("getTicketNum - got snapshot");
    console.log(docSnapshot.data());
    return docSnapshot.data().num;
}

export async function incrementTicketCounter(){
    console.log("incrementTicketCounter - before update")
    await tickets.doc('globalTicketCount').update({ num: increment });
    console.log("incrementTicketCounter - after update");

    let currTicketNum;
    try {
        console.log("incrementTicketCounter - try block");
        currTicketNum = await getTicketNum();
    } catch (e) {
        console.log("incrementTicketCounter - catch block");
        throw new Error(e.message);
    }

    console.log(`incrementTicketCounter - currTicketNum: ${currTicketNum}`);
    return currTicketNum;
}

export async function checkUser(userId){
    let docSnapshot;

    try {
        console.log("checkuser- try block");
        docSnapshot = await users.doc(userId).get();
    } catch (e) {
        console.log("checkuser - catch block");
        throw new Error(e.message);
    }

    return docSnapshot.exists;

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
        throw new Error(error.message);
      });
}
