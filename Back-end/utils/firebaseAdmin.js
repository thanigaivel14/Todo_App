import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const Admin=admin.initializeApp({
 credential:admin.credential.cert(serviceAccount)
});

export default Admin;