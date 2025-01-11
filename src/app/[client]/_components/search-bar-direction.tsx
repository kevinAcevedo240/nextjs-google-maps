import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarDirectionProps {
  onSearchResult: (result: {
    nombre: string;
    latitud: number;
    longitud: number;
    duracion: string;
  } | null) => void;
  onSearchError: (query: string) => void;
  onLocationUpdate: (lat: number, lng: number) => void;
}

const SearchBarDirection: React.FC<SearchBarDirectionProps> = ({
  onSearchResult,
  onSearchError,
  onLocationUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
//   const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Inicializa el autocompletado de Google Places al montar el componente
  useEffect(() => {
    if (inputRef.current && window.google) {
      const autoCompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
        // Elimina restricciones para que busque cualquier tipo de lugar
        types: [], 
        fields: ["name", "geometry", "place_id", "formatted_address"], // Incluye campos relevantes
      });
  
      autoCompleteInstance.addListener("place_changed", () => {
        const place = autoCompleteInstance.getPlace();
        if (place.geometry) {
          const location = place.geometry.location;
          if (location) {
            const lat = location.lat();
            const lng = location.lng();
            onLocationUpdate(lat, lng); // Actualizar ubicación en el mapa
            onSearchResult({
              nombre: place.name || "Lugar encontrado",
              latitud: lat,
              longitud: lng,
              duracion: "0", // Ajusta según lo que necesites
            });
          } else {
            onSearchError(inputRef.current?.value || "");
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }
        } else {
          onSearchError(inputRef.current?.value || "");
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }
      });
  
    //   setAutocomplete(autoCompleteInstance);
    }
  }, [onSearchResult, onSearchError, onLocationUpdate]);



  return (
    <div className="relative flex items-center space-x-4 w-full">
      <Input
      ref={inputRef}
      type="text"
      placeholder="Buscar dirección..."
      className="border border-black dark:border-white/50 p-2 shadow-cartoon-small-xs dark:shadow-cartoon-small-xs-dark rounded-lg w-full placeholder:text-base"
      />
      <span className="absolute right-3">
      <Search/>
      </span>
    </div>
  );
};

export default SearchBarDirection;
