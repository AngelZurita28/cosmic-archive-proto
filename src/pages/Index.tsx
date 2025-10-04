import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";

interface Chat {
  id: number;
  title: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  showArticles?: boolean;
}

// Dummy conversation data
const DUMMY_CONVERSATIONS: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      role: "user",
      content: "¿Cuáles son los principales efectos de la microgravedad en la pérdida ósea de ratones?",
    },
    {
      id: 2,
      role: "assistant",
      content: `La **microgravedad** tiene efectos significativos en la salud ósea de los ratones, similares a lo observado en astronautas humanos. Los principales efectos incluyen:

* Disminución acelerada de la densidad mineral ósea
* Alteración en el equilibrio entre osteoblastos y osteoclastos
* Cambios en la expresión de genes relacionados con el metabolismo óseo
* Pérdida de masa ósea que puede alcanzar hasta un 20% en misiones de larga duración

Estos hallazgos son cruciales para desarrollar contramedidas efectivas. Puedes encontrar más información en los estudios de la [NASA sobre fisiología espacial](https://www.nasa.gov/missions/station/).`,
      showArticles: true,
    },
  ],
  2: [
    {
      id: 1,
      role: "user",
      content: "¿Qué técnicas de cultivo de lechuga se están probando en la ISS?",
    },
    {
      id: 2,
      role: "assistant",
      content: `En la **Estación Espacial Internacional** se están probando varias técnicas innovadoras para el cultivo de lechuga:

* Sistemas hidropónicos con iluminación LED optimizada
* Control preciso de nutrientes y pH
* Monitoreo continuo de humedad y temperatura

Estos experimentos son fundamentales para futuras misiones a Marte y la Luna, donde la producción de alimentos frescos será esencial para la salud de los astronautas.`,
      showArticles: false,
    },
  ],
};

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, title: "Pérdida Ósea en Ratones" },
    { id: 2, title: "Cultivo de Lechuga Espacial" },
  ]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showFunFact, setShowFunFact] = useState(true);
  const [nextChatId, setNextChatId] = useState(3);
  const [nextMessageId, setNextMessageId] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    setShowFunFact(true);
  };

  const handleSelectChat = (chatId: number) => {
    setActiveChat(chatId);
    setMessages(DUMMY_CONVERSATIONS[chatId] || []);
    setShowFunFact(false);
  };

  const handleSubmit = (message: string, isSearchMode: boolean) => {
    // Hide fun fact when user starts typing
    setShowFunFact(false);

    // If no active chat, create a new one
    if (activeChat === null) {
      const newChatId = nextChatId;
      const newChat: Chat = {
        id: newChatId,
        title: message.slice(0, 30) + (message.length > 30 ? "..." : ""),
      };
      setChats([newChat, ...chats]);
      setActiveChat(newChatId);
      setNextChatId(nextChatId + 1);
    }

    // Add user message
    const userMessage: Message = {
      id: nextMessageId,
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setNextMessageId(nextMessageId + 1);

    // Simulate AI response with delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: nextMessageId + 1,
        role: "assistant",
        content: isSearchMode
          ? `He encontrado información relevante sobre **"${message}"**. Los estudios más recientes indican que este es un área de investigación activa en la ciencia espacial.\n\nLos principales hallazgos incluyen:\n\n* Avances significativos en metodologías de investigación\n* Nuevos protocolos experimentales validados\n* Colaboraciones internacionales en curso\n\nPuedes consultar los artículos científicos relacionados a continuación para profundizar en el tema.`
          : `Excelente pregunta sobre **"${message}"**. Basándome en la literatura científica disponible, puedo decirte que este tema está siendo activamente investigado por la comunidad científica espacial.\n\nLos aspectos más relevantes incluyen consideraciones sobre la fisiología humana, la adaptación a entornos extremos, y las implicaciones para futuras misiones de larga duración.\n\n¿Te gustaría que profundice en algún aspecto específico?`,
        showArticles: isSearchMode,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setNextMessageId(nextMessageId + 2);
    }, 1500);
  };

  const handleInputChange = (hasText: boolean) => {
    if (hasText && messages.length === 0) {
      setShowFunFact(false);
    } else if (!hasText && messages.length === 0) {
      setShowFunFact(true);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatView
        messages={messages}
        onSubmit={handleSubmit}
        showFunFact={showFunFact}
        onInputChange={handleInputChange}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};

export default Index;
