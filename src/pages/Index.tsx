import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";
import { type Article } from "@/components/ArticleCards";

// --- Tipos Unificados ---
interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  showArticles?: boolean;
  relatedArticles?: Article[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface ApiResponse {
  answer: string;
  relatedArticles: Article[];
}

// Payload que se enviará a la API, ahora con todos los campos
interface AskPayload {
  question: string;
  history: Message[];
  isSearchMode: boolean;
}

// --- Función de API Actualizada ---
const askApi = async (payload: AskPayload): Promise<ApiResponse> => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/rag/ask`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Enviamos el payload completo que incluye el historial
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "La respuesta de la red no fue exitosa"
    );
  }

  return response.json();
};

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showFunFact, setShowFunFact] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Carga y guardado de conversaciones (sin cambios)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("conversations");
      if (saved) setConversations(JSON.parse(saved));
    } catch {
      localStorage.removeItem("conversations");
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  // Mutación (sin cambios en su lógica interna)
  const mutation = useMutation({
    mutationFn: askApi,
    onSuccess: (data, variables) => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.answer,
        showArticles:
          variables.isSearchMode && data.relatedArticles?.length > 0,
        relatedArticles: data.relatedArticles,
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeChatId
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        )
      );
    },
    onError: (error) => {
      console.error("Error al llamar a la API:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: "assistant",
        text: "Lo siento, ocurrió un error. Intenta de nuevo.",
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeChatId
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        )
      );
    },
  });

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: "Nueva Conversación",
      messages: [],
    };
    setConversations([newConversation, ...conversations]);
    setActiveChatId(newId);
    setShowFunFact(true);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    const selected = conversations.find((c) => c.id === chatId);
    setShowFunFact((selected?.messages.length ?? 0) === 0);
    setIsSidebarOpen(false);
  };

  // --- Función handleSubmit FUSIONADA ---
  const handleSubmit = (message: string, isSearchMode: boolean) => {
    setShowFunFact(false);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: message,
    };

    // Obtenemos el historial ANTES de añadir el nuevo mensaje del usuario
    const historyForApi = activeChat ? [...activeChat.messages] : [];

    // Lógica para añadir el mensaje del usuario y crear un chat si no existe
    let currentChatId = activeChatId;
    if (currentChatId === null) {
      const newId = `conv-${Date.now()}`;
      const newConversation: Conversation = {
        id: newId,
        title: message.slice(0, 30) + (message.length > 30 ? "..." : ""),
        messages: [userMessage],
      };
      setConversations((prev) => [newConversation, ...prev]);
      setActiveChatId(newId);
    } else {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentChatId
            ? { ...conv, messages: [...conv.messages, userMessage] }
            : conv
        )
      );
    }

    // Llamamos a la mutación con el payload completo
    mutation.mutate({
      question: message,
      history: historyForApi,
      isSearchMode,
    });
  };

  const handleInputChange = (hasText: boolean) => {
    if (hasText && (activeChat?.messages.length ?? 0) === 0) {
      setShowFunFact(false);
    } else if (!hasText && (activeChat?.messages.length ?? 0) === 0) {
      setShowFunFact(true);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* ... JSX sin cambios ... */}
      <Sidebar
        chats={conversations.map((c) => ({ id: c.id, title: c.title }))}
        activeChat={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatView
        messages={activeChat?.messages || []}
        onSubmit={handleSubmit}
        showFunFact={showFunFact}
        onInputChange={handleInputChange}
        onOpenMenu={() => setIsSidebarOpen(true)}
        isLoading={mutation.isPending}
      />
    </div>
  );
};

export default Index;
