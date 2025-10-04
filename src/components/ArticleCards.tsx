import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  id: number;
  title: string;
  summary: string;
  link: string;
}

const DUMMY_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Efectos de la Microgravedad en la Densidad Ósea",
    summary: "Un estudio exhaustivo sobre cómo la ausencia de gravedad afecta la estructura ósea de los astronautas durante misiones espaciales prolongadas. Los resultados muestran una pérdida significativa que requiere contramedidas específicas.",
    link: "https://www.nasa.gov/missions/station/",
  },
  {
    id: 2,
    title: "Contramedidas para la Pérdida Ósea Espacial",
    summary: "Investigación sobre protocolos de ejercicio y suplementación nutricional diseñados para minimizar la pérdida de masa ósea. Se evalúan diferentes dispositivos de resistencia y su efectividad en condiciones de ingravidez.",
    link: "https://www.nasa.gov/missions/station/",
  },
  {
    id: 3,
    title: "Modelos Animales en Investigación Espacial",
    summary: "Análisis del uso de ratones como modelos para estudiar los efectos fisiológicos del vuelo espacial. Se discuten las similitudes y limitaciones en la extrapolación de resultados a humanos.",
    link: "https://www.nasa.gov/missions/station/",
  },
];

const ArticleCards = () => {
  return (
    <div className="w-full space-y-4 animate-slide-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-border" />
        <p className="text-sm font-medium text-muted-foreground">
          Artículos Relacionados
        </p>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {DUMMY_ARTICLES.map((article) => (
          <article
            key={article.id}
            className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="font-serif text-lg font-semibold text-foreground mb-3 leading-tight">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {article.summary}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-transparent p-0 h-auto font-medium"
              asChild
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                Leer más
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ArticleCards;
