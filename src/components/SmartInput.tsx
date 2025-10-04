import { useState } from "react";
import { Send, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SmartInputProps {
  onSubmit: (message: string, isSearchMode: boolean) => void;
  onInputChange?: (hasText: boolean) => void;
}

const SmartInput = ({ onSubmit, onInputChange }: SmartInputProps) => {
  const [message, setMessage] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message, isSearchMode);
      setMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    onInputChange?.(value.length > 0);
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-2 bg-card border border-border rounded-lg shadow-sm p-2">
        {/* Search Mode Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleSearchMode}
          className={`flex-shrink-0 ${
            isSearchMode
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Input */}
        <Input
          value={message}
          onChange={handleInputChange}
          placeholder={
            isSearchMode
              ? "Busca artículos sobre..."
              : "Haz una pregunta..."
          }
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim()}
          className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default SmartInput;
