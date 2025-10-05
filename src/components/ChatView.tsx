import { useEffect, useRef } from "react";
import { Menu, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import FunFact from "./FunFact";
import SmartInput from "./SmartInput";
import ArticleCards, { type Article } from "./ArticleCards";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  showArticles?: boolean;
  relatedArticles?: Article[];
}

interface ChatViewProps {
  messages: Message[];
  onSubmit: (message: string, isSearchMode: boolean) => void;
  showFunFact: boolean;
  onInputChange?: (hasText: boolean) => void;
  onOpenMenu: () => void;
  isLoading: boolean;
}

const ChatView = ({
  messages,
  onSubmit,
  showFunFact,
  onInputChange,
  onOpenMenu,
  isLoading,
}: ChatViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const isInitialView = messages.length === 0 && !isLoading;

  return (
    <div className="flex-1 flex flex-col h-screen bg-background relative">
      <header className="absolute top-4 left-4 z-30 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMenu}
          className="h-10 w-10"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </header>

      {isInitialView ? (
        <div className="h-full flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-8 mb-8">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Data Orbit
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora el conocimiento científico sobre la vida en el espacio
            </p>
          </div>
          <div className="w-full max-w-3xl">
            <SmartInput
              onSubmit={onSubmit}
              onInputChange={onInputChange}
              isCentered
            />
          </div>
          <div className="mt-6">
            <FunFact isVisible={showFunFact} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pt-16 pb-32">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex items-start space-x-4 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot size={18} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] ${
                        message.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.sender === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-p:mb-4 prose-ul:mb-4 prose-h3:mt-6 prose-h3:mb-2 prose-p:text-foreground">
                          <ReactMarkdown
                            components={{
                              a: ({ node, ...props }) => (
                                <a
                                  className="text-blue-500 underline dark:text-blue-400"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="bg-primary/10 text-foreground leading-relaxed px-4 py-2 rounded-lg">
                          {message.text}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* --- CAMBIO AQUÍ --- */}
                  {/* Le pasamos las tarjetas del 'message' que se está renderizando actualmente */}
                  {message.sender === "assistant" && message.showArticles && (
                    <div className="mt-6">
                      <ArticleCards articles={message.relatedArticles || []} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 space-y-2 pt-1">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 md:pl-64 border-t border-border bg-background/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <SmartInput
                onSubmit={onSubmit}
                onInputChange={onInputChange}
                isCentered={false}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatView;
