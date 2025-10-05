import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

interface FunFactProps {
  isVisible: boolean;
}

// Función para llamar a nuestro nuevo endpoint en el backend
const fetchFunFact = async (): Promise<{ funFact: string }> => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/rag/funfact`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("No se pudo obtener el dato curioso.");
  }
  return response.json();
};

const FunFact = ({ isVisible }: FunFactProps) => {
  // useQuery para obtener y cachear el dato curioso.
  // 'funFact' es la clave única para esta consulta.
  // refetchOnWindowFocus: false evita que se recargue cada vez que cambias de pestaña.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["funFact"],
    queryFn: fetchFunFact,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Considera el dato "fresco" por 5 minutos
  });

  const getFactContent = () => {
    if (isLoading) {
      // Muestra un esqueleto de carga mientras se obtiene el dato
      return <Skeleton className="h-4 w-[300px] mx-auto" />;
    }
    if (isError || !data?.funFact) {
      // Muestra un dato por defecto si hay un error
      return (
        <>
          <span className="font-medium">Sabías que...</span> los astronautas
          pueden crecer hasta 5 cm en el espacio debido a la expansión de su
          columna vertebral.
        </>
      );
    }
    // Muestra el dato obtenido de la API, separando la primera parte para estilo
    const factText = data.funFact.replace(/^Sabías que...\s*/i, "");
    return (
      <>
        <span className="font-medium">Sabías que...</span> {factText}
      </>
    );
  };

  return (
    <div
      className={`transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="text-muted-foreground text-center text-sm max-w-xl mx-auto">
        {getFactContent()}
      </p>
    </div>
  );
};

export default FunFact;
