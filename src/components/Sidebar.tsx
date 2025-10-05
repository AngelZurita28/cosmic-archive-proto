import { Plus, BookOpen, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  isOpen,
  onClose,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  const handleSelectChat = (id: string) => {
    onSelectChat(id);
    onClose();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r border-border bg-background flex flex-col transition-all duration-300 md:relative md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Modo Colapsado - Solo Hamburguesa */}
      {isCollapsed ? (
        <div className="flex flex-col items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-10 w-10"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      ) : (
        <>
          {/* Header Normal */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  El Archivo
                </h2>
              </div>
              <div className="flex gap-1">
                {/* Botón de colapsar - visible solo en desktop */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapse}
                  className="hidden md:flex h-8 w-8"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                {/* Botón de cerrar - visible solo en mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 md:hidden"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleNewChat}
              className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              Nuevo Chat
            </Button>
          </div>

          {/* Chat History Normal */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors truncate ${
                    activeChat === chat.id
                      ? "bg-secondary text-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
