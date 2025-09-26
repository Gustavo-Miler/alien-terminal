// Importa e configura o SDK do Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

// Cole sua configuração do Firebase aqui (a mesma dos outros arquivos)
const firebaseConfig = {
  apiKey: "AIzaSyDWQydohtIvlVZq0sNoXgNEhob8D4TwZBA",
  authDomain: "alien-terminal.firebaseapp.com",
  projectId: "alien-terminal",
  storageBucket: "alien-terminal.firebasestorage.app",
  messagingSenderId: "484368179427",
  appId: "1:484368179427:web:f19d379b634d0bcd7025d6",
  measurementId: "G-XHLNKZC48J",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Opcional: manipular notificações em background
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // Opcional: adicione um ícone na pasta public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
