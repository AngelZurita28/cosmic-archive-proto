import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";

// Tipos de datos unificados
interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  showArticles?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface ApiResponse {
  answer: string;
}

const askApi = async (question: string): Promise<ApiResponse> => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/rag/ask`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
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

  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem("conversations");
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
      localStorage.removeItem("conversations");
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const mutation = useMutation({
    mutationFn: askApi,
    onSuccess: (data, variables) => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.answer,
        showArticles: true,
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
        text: "Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta de nuevo.",
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
    const selectedChat = conversations.find((c) => c.id === chatId);
    setShowFunFact((selectedChat?.messages.length ?? 0) === 0);
    setIsSidebarOpen(false);
  };

  const handleSubmit = (message: string, isSearchMode: boolean) => {
    setShowFunFact(false);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: message,
    };

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
      // Actualizamos el ID del chat activo para la mutación
      // Esto se manejará en el `useEffect` que observa `activeChatId`
    } else {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentChatId
            ? { ...conv, messages: [...conv.messages, userMessage] }
            : conv
        )
      );
    }

    // Disparamos la llamada a la API
    mutation.mutate(message);
  };

  // Hook para asegurar que la mutación use el ID de chat más reciente
  useEffect(() => {
    if (mutation.isPending && activeChatId) {
      // Opcional: Lógica adicional si se necesita el ID activo durante la mutación
    }
  }, [activeChatId, mutation.isPending]);

  const handleInputChange = (hasText: boolean) => {
    if (hasText && (activeChat?.messages.length ?? 0) === 0) {
      setShowFunFact(false);
    } else if (!hasText && (activeChat?.messages.length ?? 0) === 0) {
      setShowFunFact(true);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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
