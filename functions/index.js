const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Esta função é acionada sempre que um novo alerta é criado no Realtime Database
exports.sendPushNotification = functions.database.ref("/alertas/{pushId}")
    .onCreate(async (snapshot, context) => {
      // Pega o texto do alerta que foi criado
      const alertData = snapshot.val();
      const alertText = alertData.texto;

      // Monta o payload da notificação
      const payload = {
        notification: {
          title: "Novo Alerta!",
          body: alertText,
          // icon: "your-icon-url", // Opcional
        },
      };

      // Busca todos os tokens de notificação salvos no banco
      const tokensSnapshot = await admin.database().ref("fcmTokens").get();
      if (!tokensSnapshot.exists()) {
        console.log("No tokens to send notification to.");
        return;
      }

      const tokens = Object.values(tokensSnapshot.val());

      // Envia a notificação para todos os tokens
      console.log(`Sending notification to ${tokens.length} tokens.`);
      await admin.messaging().sendToDevice(tokens, payload);
    });