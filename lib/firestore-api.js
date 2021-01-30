import app, { fb, firestore } from "./firebase";

const users = firestore.collection("/catalyst-users");
const tickets = firestore.collection("/catalyst-ticket-counter");
const increment = fb.firestore.FieldValue.increment(1);


export async function getTicketNum(){

    console.log("getTicketNum - before get");
    let docSnapshot = await tickets.doc('globalTicketCount').get();
    console.log("getTicketNum - got snapshot");
    console.log(docSnapshot.data());
    return docSnapshot.data().num;

}

export async function incrementTicketCounter(){

    console.log("incrementTicketCounter - before update")
    await tickets.doc('globalTicketCount').update({ num: increment });
    console.log("incrementTicketCounter - after update");
    let currTicketNum = await getTicketNum();
    console.log(`incrementTicketCounter - currTicketNum: ${currTicketNum}`);
    return currTicketNum;

}

export async function checkUser(userId){

    let docSnapshot = await users.doc(userId).get();
    return docSnapshot.exists;

}

export async function addUser(userId, userEmail, userfName, userlName, userName, userticketNum){

    await users.doc(userId).set({
        email: userEmail,
        username: userName,
        firstName: userfName,
        lastName: userlName,
        ticketNum: userticketNum
    });

}

export async function registerUser(userId, userEmail, userPass, userfName, userlName, userName, userticketNum){

    let userCred = await app.auth().createUserWithEmailAndPassword(userEmail, userPass);
    let user = userCred.user;

    try {
        await addUser(userId, userEmail, userfName, userlName, userName, userticketNum);
    } catch (e) {
        // If addUser doesn't work, delete the registered user from auth so they can retry
        console.log("registerUser - before delete");
        await user.delete();
        console.log("registerUser - after delete");
        throw new Error(e.message);
    }
}
