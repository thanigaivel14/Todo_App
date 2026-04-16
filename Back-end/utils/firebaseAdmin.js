import admin from "firebase-admin";
const Admin=admin.initializeApp({
 credential:admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
});

export default Admin;