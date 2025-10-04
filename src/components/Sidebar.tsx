import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Chat {
  id: number;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChat: number | null;
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
}

const Sidebar = ({ chats, activeChat, onNewChat, onSelectChat }: SidebarProps) => {
  return (
    <aside className="w-64 h-screen border-r border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="font-serif text-lg font-semibold text-foreground">
            El Archivo
          </h2>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
          Nuevo Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
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
    </aside>
  );
};

export default Sidebar;
