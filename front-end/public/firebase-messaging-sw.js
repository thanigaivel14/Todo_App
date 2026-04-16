importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAK0YUoWclOz6cYKb7HDgp41Fby_FjXeOU",
  authDomain: "push-notification-c17f8.firebaseapp.com",
  projectId: "push-notification-c17f8",
  storageBucket: "push-notification-c17f8.firebasestorage.app",
  messagingSenderId: "852277374156",
  appId: "1:852277374156:web:6283e6c117dcb748cea669"
});

const messaging = firebase.messaging();

// ✅ Background messages
messaging.onBackgroundMessage( function (payload) {
});