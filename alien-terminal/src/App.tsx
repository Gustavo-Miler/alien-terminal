import "./styles/Terminal.css";
import { useState, useEffect, useRef } from "react";
const App = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    "-- Estabelecendo comunicação com a nave mãe...",
    "-- Aguarde comunicações...",
  ]);

  const addMessage = (newMessage: string) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    // Lista de mensagens de exemplo que serão exibidas
    const exampleMessages = [
      '[AVISO RECEBIDO] - - - Rodada de shots no piso 1',
      '[ALERTA] - - - Concurso de fantasias iniciado, todos os tripulantes para o salão principal!',
      '[MENSAGEM DA NAVE-MÃE] - - - Celular perdido! Pedimos a todos os tripulantes que comuniquem a STAFF caso seja encontrado.',
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      // Adiciona uma nova mensagem à lista a cada 5 segundos
      if (messageIndex < exampleMessages.length) {
        addMessage(exampleMessages[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(interval); // Para o intervalo quando todas as mensagens forem exibidas
      }
    }, 2000);

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []); // O array de dependências vazio garante que o efeito seja executado apenas uma vez


  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="terminal-container" ref={terminalRef}>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </>
  );
};

export default App;
