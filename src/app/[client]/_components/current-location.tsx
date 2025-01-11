import { Button } from "@/components/ui/button";
import { Marker } from "@/types";
import { LocateFixed } from "lucide-react";
import React from "react";

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
    
        if (navigator.geolocation) {
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
                  console.log("Permiso denegado por el usuario.");
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.log("Información de ubicación no disponible.");
                  break;
                case error.TIMEOUT:
                  console.log("Tiempo de espera agotado para obtener la ubicación.");
                  break;
                default:
                  console.log("Error desconocido al obtener la ubicación.");
              }
            },
            options
          );
        } else {
          console.error("Geolocalización no soportada por el navegador.");
        }
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
