interface FunFactProps {
  isVisible: boolean;
}

const FunFact = ({ isVisible }: FunFactProps) => {
  return (
    <div
      className={`transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="text-muted-foreground text-center text-sm max-w-xl mx-auto">
        <span className="font-medium">Sabías que...</span> los astronautas
        pueden crecer hasta 5 cm en el espacio debido a la expansión de su
        columna vertebral.
      </p>
    </div>
  );
};

export default FunFact;
