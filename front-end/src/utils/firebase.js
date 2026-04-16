import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
const app = initializeApp(firebaseConfig);


// 🔑 Get FCM token
export const generateToken = async () => {
  const permission = Notification.permission;
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BPNA0bmoGPe4Iqq6KzpA0OaWGcA4_uWgTR8QtmnkI--KF0HR0xPOCEWN0npkGu5RMu3biPYtW68TCmruHB-V6tk"
    });
    return token;
  }
  else {
    throw new Error("permission is not granted");
  }
};

export const messaging = getMessaging(app);


onMessage(messaging, (payload) => {
  alert(payload.notification.title + " - " + payload.notification.body);
})
