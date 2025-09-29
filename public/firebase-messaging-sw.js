// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDWQydohtIvlVZq0sNoXgNEhob8D4TwZBA",
  authDomain: "alien-terminal.firebaseapp.com",
  projectId: "alien-terminal",
  storageBucket: "alien-terminal.appspot.com",
  messagingSenderId: "484368179427",
  appId: "1:484368179427:web:f19d379b634d0bcd7025d6",
  measurementId: "G-XHLNKZC48J",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Função auxiliar para limpar todas as notificações
function clearAllNotifications(event) {
  // O event.waitUntil garante que o SW não termine antes da operação assíncrona
  return self.registration.getNotifications().then((notifications) => {
    notifications.forEach((notification) => notification.close());
    console.log(`[SW] ${notifications.length} notificações limpas.`);
  });
}

// Ouve pelo evento de PUSH (quando a mensagem chega)
self.addEventListener("push", function (event) {
  // ... (código para mostrar a notificação não muda) ...
  console.log("[Service Worker] Push Recebido.");
  let notificationTitle = "Nova Notificação";
  let notificationOptions = {
    body: "Você tem uma nova mensagem!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationTitle = data.notification.title;
      notificationOptions.body = data.notification.body;
    } catch (e) {
      /* Usa o padrão */
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Ouve pelo evento de CLIQUE na notificação
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Limpa TODAS as outras notificações ao clicar em uma
  event.waitUntil(
    clearAllNotifications(event).then(() => {
      // E depois abre/foca na janela do app
      return clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          if (clientList.length > 0) {
            let client = clientList[0];
            for (let i = 0; i < clientList.length; i++) {
              if (clientList[i].focused) {
                client = clientList[i];
              }
            }
            return client.focus();
          }
          return clients.openWindow("/");
        });
    })
  );
});

// NOVO: Ouve por MENSAGENS vindas da página
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "clear_notifications") {
    console.log("[SW] Recebido comando para limpar notificações da página.");
    event.waitUntil(clearAllNotifications(event));
  }
});
