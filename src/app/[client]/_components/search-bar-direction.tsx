import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface SearchBarDirectionProps {
  onSearchResult: (
    result: {
      nombre: string;
      latitud: number;
      longitud: number;
      duracion: string;
    } | null
  ) => void;
  onLocationUpdate: (lat: number, lng: number) => void;
}

const SearchBarDirection: React.FC<SearchBarDirectionProps> = ({
  onSearchResult,
  onLocationUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isErrorHandled = useRef(false); // Flag para manejar el error

  const searchError = (notFoundDirection: string) => {
    toast.error(`La dirección ${notFoundDirection} no fue encontrada en el mapa`, {
      className:
        "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
    });
  };

  useEffect(() => {
    const initializeAutocomplete = () => {
        // Resetea el flag de error
        isErrorHandled.current = false;
      if (inputRef.current && window.google) {
        const autoCompleteInstance = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: [],
            fields: ["name", "geometry", "place_id", "formatted_address"],
          }
        );

        autoCompleteInstance.addListener("place_changed", () => {
          const place = autoCompleteInstance.getPlace();
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // Resetea el flag de error
            isErrorHandled.current = false;

            onLocationUpdate(lat, lng);
            onSearchResult({
              nombre: place.name || "Lugar encontrado",
              latitud: lat,
              longitud: lng,
              duracion: "0",
            });
          } else {
            handleSearchError();
          }
        });
      }
    };

    const handleSearchError = () => {
      if (!isErrorHandled.current) {
        isErrorHandled.current = true; // Marca el error como manejado
        searchError(inputRef.current?.value || "");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    };

    initializeAutocomplete();
  }, [onSearchResult, onLocationUpdate]);

  return (
    <div className="relative flex items-center space-x-4 w-full">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Buscar dirección..."
        className="border border-black dark:border-white/50 p-2 shadow-cartoon-small-xs dark:shadow-cartoon-small-xs-dark rounded-lg w-full placeholder:text-base"
      />
      <span className="absolute right-3">
        <Search />
      </span>
    </div>
  );
};

export default SearchBarDirection;
