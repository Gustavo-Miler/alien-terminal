// public/firebase-messaging-sw.js

// Este listener (ouvinte) captura QUALQUER evento de push que o navegador recebe.
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Recebido.');

  // Define uma notificação padrão, caso a mensagem venha vazia (como a do botão de teste)
  let notificationTitle = 'Nova Notificação';
  let notificationOptions = {
    body: 'Você tem uma nova mensagem!',
    icon: '/favicon.ico' // Opcional: adicione um ícone na sua pasta public
  };

  // Tenta extrair os dados da notificação real enviada pelo Firebase.
  // Se a mensagem tiver dados (payload), usamos eles.
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[Service Worker] Dados da notificação:', data);
      notificationTitle = data.notification.title;
      notificationOptions.body = data.notification.body;
      // Você pode adicionar mais opções aqui se as enviar no payload, ex: icon, image, etc.
    } catch (e) {
      console.error('Erro ao processar os dados do push:', e);
    }
  }

  // Mostra a notificação.
  // event.waitUntil garante que o service worker não "durma" antes da notificação ser exibida.
  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});