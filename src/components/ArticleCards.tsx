// Definimos una interfaz para asegurar que los datos de los artículos siempre tengan la misma forma.
export interface Article {
  title: string;
  summary: string;
  link: string;
}

interface ArticleCardsProps {
  articles: Article[];
}

const ArticleCards = ({ articles }: ArticleCardsProps) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        // Envolvemos toda la tarjeta en una etiqueta <a> para que sea clickeable
        <a
          key={index}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-1.5 p-6">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {article.title}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-sm text-muted-foreground">{article.summary}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ArticleCards;
