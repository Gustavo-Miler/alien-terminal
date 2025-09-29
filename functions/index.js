// functions/index.js

const { onValueCreated } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// Carrega o arquivo da chave de conta de serviço para garantir a autenticação
const serviceAccount = require("./service-account-key.json");

// Inicializa o Admin SDK com as credenciais explícitas e a databaseURL correta
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alien-terminal-default-rtdb.firebaseio.com" // SEM a barra no final
});

exports.sendPushNotification = onValueCreated("/alertas/{pushId}", async (event) => {
  const alertData = event.data.val();
  functions.logger.log("Função acionada pelo alerta:", alertData);

  // Prepara a notificação
  const payload = {
    notification: {
      title: "Novo Alerta!",
      body: `Alerta recebido: ${alertData.texto}`,
    },
  };

  // Busca os tokens no banco de dados
  const tokensSnapshot = await admin.database().ref("fcmTokens").get();
  if (!tokensSnapshot.exists()) {
    functions.logger.log("Nenhum token de notificação encontrado no banco.");
    return null;
  }
  
  const tokens = Object.keys(tokensSnapshot.val());
  if (tokens.length === 0) {
    functions.logger.log("A lista de tokens está vazia.");
    return null;
  }

  functions.logger.log(`Preparando para enviar notificação para ${tokens.length} token(s).`);

  try {
    // Usa o método moderno e correto: sendEachForMulticast
    const multicastMessage = {
      tokens: tokens,
      notification: payload.notification,
    };
    
    const response = await admin.messaging().sendEachForMulticast(multicastMessage);
    
    functions.logger.log("Mensagens enviadas com sucesso:", response.successCount);
    if (response.failureCount > 0) {
      functions.logger.error("Falha ao enviar para alguns dispositivos:", response.failureCount);
    }
  } catch (error) {
    functions.logger.error("ERRO CRÍTICO ao chamar a API de envio do FCM:", error);
  }
  
  return null;
});