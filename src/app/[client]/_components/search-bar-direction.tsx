import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Marker } from "@/types";

interface SearchBarDirectionProps {
  onSearchResult: (result: Marker | null) => void;
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
              name: place.name || "Lugar encontrado",
              latitude: lat,
              longitude: lng,
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

  return <Input ref={inputRef} type="text" placeholder="Buscar dirección..." />;
};

export default SearchBarDirection;
