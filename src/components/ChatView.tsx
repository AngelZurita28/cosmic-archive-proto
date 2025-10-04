import { useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import FunFact from "./FunFact";
import SmartInput from "./SmartInput";
import ArticleCards from "./ArticleCards";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  showArticles?: boolean;
}

interface ChatViewProps {
  messages: Message[];
  onSubmit: (message: string, isSearchMode: boolean) => void;
  showFunFact: boolean;
  onInputChange?: (hasText: boolean) => void;
  onOpenMenu: () => void;
}

const ChatView = ({ messages, onSubmit, showFunFact, onInputChange, onOpenMenu }: ChatViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isInitialView = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-screen bg-background relative">
      {/* Header with hamburger menu */}
      <header className="absolute top-4 left-4 z-30">
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
        /* Initial View with centered input */
        <div className="h-full flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-8 mb-8">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              El Archivo Biocósmico
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora el conocimiento científico sobre la vida en el espacio
            </p>
          </div>

          {/* Centered Input */}
          <div className="w-full max-w-3xl">
            <SmartInput onSubmit={onSubmit} onInputChange={onInputChange} isCentered />
          </div>

          {/* Fun Fact below input */}
          <div className="mt-6">
            <FunFact isVisible={showFunFact} />
          </div>
        </div>
      ) : (
        /* Chat Messages View */
        <>
          <div className="flex-1 overflow-y-auto pt-16 pb-24">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`max-w-[75%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="text-foreground leading-relaxed mb-3 last:mb-0">
                                  {children}
                                </p>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-foreground">
                                  {children}
                                </strong>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside space-y-1 text-foreground my-3">
                                  {children}
                                </ul>
                              ),
                              li: ({ children }) => (
                                <li className="text-foreground">{children}</li>
                              ),
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-foreground leading-relaxed">{message.content}</p>
                      )}
                    </div>
                  </div>

                  {/* Show articles after assistant message if flagged */}
                  {message.role === "assistant" && message.showArticles && (
                    <div className="mt-6">
                      <ArticleCards />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed Input at Bottom */}
          <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background">
            <SmartInput onSubmit={onSubmit} onInputChange={onInputChange} isCentered={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatView;
