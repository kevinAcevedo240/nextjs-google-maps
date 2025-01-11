import { Button } from "@/components/ui/button";
import { Marker } from "@/types";
import { LocateFixed } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface CurrentLocationProps {
    onLocationUpdate: (marker: Marker) => void;
}

const CurrentLocation: React.FC<CurrentLocationProps> = ({ onLocationUpdate }) => {
    const getLocation = () => {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        };

        if (!navigator.geolocation) {
          console.error("Geolocalización no soportada por el navegador.");
          return;
        }
    
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
  
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              {
                location: { lat: latitude, lng: longitude },
              },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  onLocationUpdate({
                    name: "",
                    latitude: latitude,
                    longitude: longitude,
                    address: results[0].formatted_address,
                  });
                } else {
                  console.error("Geocode error: ", status);
                  onLocationUpdate({
                    name: "",
                    latitude: latitude,
                    longitude: longitude,
                    address: "",
                  });
                }
              }
            );
          },
          (error) => {
            console.error("Geolocation error: ", error.message);
            switch (error.code) {
              case error.PERMISSION_DENIED:
              toast.error("Permiso denegado por el usuario.", {
                className:
                "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
              });
              break;
              case error.POSITION_UNAVAILABLE:
              toast.error("Información de ubicación no disponible.", {
                className:
                "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
              });
              break;
              case error.TIMEOUT:
              toast.error("Tiempo de espera agotado para obtener la ubicación.", {
                className:
                "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
              });
              break;
              default:
              toast.error("Error desconocido al obtener la ubicación.", {
                className:
                "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
              });
            }
          },
          options
        );
      };
  return (
    <Button
    variant={"ghost"}
      onClick={getLocation}
    >
      <LocateFixed />
      <span className="hidden sm:block">Tu Ubicación</span>
    </Button>
  );
};

export default CurrentLocation;
