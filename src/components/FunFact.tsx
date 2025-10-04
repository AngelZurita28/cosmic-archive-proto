import { Sparkles } from "lucide-react";

interface FunFactProps {
  isVisible: boolean;
}

const FunFact = ({ isVisible }: FunFactProps) => {
  return (
    <div
      className={`max-w-2xl mx-auto transition-all duration-300 ${
        isVisible ? "animate-fade-in opacity-100" : "animate-fade-out opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              Sabías que...
            </p>
            <p className="text-foreground leading-relaxed">
              Los astronautas pueden crecer hasta 5 cm en el espacio debido a la 
              expansión de su columna vertebral en condiciones de microgravedad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunFact;
