import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker as GoogleMarker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Marker } from "@/types";
import GoogleMapsIcon from "@/components/ui/icons/google-maps-icon";
import WazeIcon from "@/components/ui/icons/waze-icon";
import { toast } from "sonner";
import { travelModes } from "@/lib/travelModesConfig";

interface MapProps {
  defaultCenter: { lat: number; lng: number };
  markers: Marker[];
  tempMarker?: Marker | null;
  setTempMarker?: React.Dispatch<React.SetStateAction<Marker | null>>;
  zoom: number;
  zoomShowInfoDistance?: number;
  onModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  travelMode: string;
}

const Map: React.FC<MapProps> = ({
  defaultCenter,
  markers,
  tempMarker,
  setTempMarker,
  zoom,
  zoomShowInfoDistance,
  onModalOpen,
  travelMode = "DRIVING",
}) => {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom); // Nivel de zoom inicial
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  // Función para convertir una cadena a google.maps.TravelMode
  const getGoogleTravelMode = (mode: string) => {
    switch (mode) {
      case "BICYCLING":
        return google.maps.TravelMode.BICYCLING;
      case "WALKING":
        return google.maps.TravelMode.WALKING;
      case "DRIVING":
        return google.maps.TravelMode.DRIVING;
      case "TRANSIT":
        return google.maps.TravelMode.TRANSIT;
      default:
        return google.maps.TravelMode.DRIVING; // Valor predeterminado
    }
  };

  // Buscar el ícono correspondiente al valor de selectedTravelMode
  const selectedIcon = travelModes.find(
    (mode) => mode.value === travelMode
  )?.icon;

  useEffect(() => {
    if (markers.length > 1) {
      calculateRoute(); // Calcula la ruta cuando haya al menos 2 puntos
    } else {
      setDirectionsResponse(null); // Resetea la respuesta de direcciones si hay menos de 2 puntos
    }
  }, [markers, travelMode]);

  const handleZoomChanged = () => {
    if (map) {
      const zoomLevel = map.getZoom();
      if (zoomLevel !== undefined) {
        setCurrentZoom(zoomLevel);
      }
    }
  };

  const calculateRoute = async () => {
    if (markers.length < 2) {
      setDirectionsResponse(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    // Crear waypoints desde los marcadores intermedios.
    const waypoints = markers.slice(1, -1).map((marker) => ({
      location: { lat: marker.latitude, lng: marker.longitude },
      stopover: true,
    }));

    try {
      const results = await directionsService.route({
        origin: { lat: markers[0].latitude, lng: markers[0].longitude },
        destination: {
          lat: markers[markers.length - 1].latitude,
          lng: markers[markers.length - 1].longitude,
        },
        waypoints: waypoints,
        travelMode: getGoogleTravelMode(travelMode),
      });

      // Actualizar la respuesta de direcciones.
      setDirectionsResponse(results);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        `No fue posible calcular la ruta para el modo de viaje seleccionado, por favor intente otro modo`,
        {
          className:
            "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
        }
      );

      setDirectionsResponse(null);
    }
  };

  const handleMapClick: (e: google.maps.MapMouseEvent) => void = (e) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setTempMarker?.({
          name: "",
          latitude: lat,
          longitude: lng,
          address: results[0].formatted_address,
        });
      } else {
        console.error("Geocode error: ", status);
        setTempMarker?.({
          name: "",
          latitude: lat,
          longitude: lng,
          address: "",
        });
      }
    });
  };

  return (
    <GoogleMap
      center={defaultCenter}
      zoom={currentZoom}
      onClick={handleMapClick}
      onLoad={(map) => setMap(map)}
      onZoomChanged={handleZoomChanged}
      mapContainerClassName="rounded-lg h-[80vh] lg:h-[89vh] border border-black shadow-cartoon-small dark:shadow-cartoon-small-dark"
      options={{
        fullscreenControl: true,
        zoomControl: false,
        streetViewControl: false,
        disableDefaultUI: false,
      }}
    >
      {markers.map((marker, index) => (
        <GoogleMarker
          key={index}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          onClick={() => {
            setSelectedMarker(marker);
          }}
          icon={"/assets/custom-marker.svg"}
        />
      ))}

      {directionsResponse && (
        <>
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: true,
            }}
          />
          {directionsResponse.routes[0].legs.map((leg, index: number) => {
            // Obtén todos los puntos del trayecto
            const path = leg.steps.flatMap((step) => step.path || []);

            // Si hay puntos, calcula el punto medio exacto en la línea
            const midpoint =
              path.length > 0
                ? path[Math.floor(path.length / 2)]
                : {
                    lat:
                      (leg.start_location.lat() + leg.end_location.lat()) / 2,
                    lng:
                      (leg.start_location.lng() + leg.end_location.lng()) / 2,
                  };

            return (
              currentZoom > (zoomShowInfoDistance ?? 0) && (
                <InfoWindow
                  key={index}
                  position={midpoint}
                  options={{ disableAutoPan: true, maxWidth: 200 }}
                >
                  <div className="p-2 space-y-1 mr-2">
                    <p className="text-base font-semibold text-black flex justify-start items-center gap-1">
                      {selectedIcon}
                      {leg.duration?.text || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Distancia: {leg.distance?.text || "N/A"}
                    </p>
                  </div>
                </InfoWindow>
              )
            );
          })}
        </>
      )}

      {tempMarker && (
        <GoogleMarker
          icon={"/assets/custom-temp-marker.svg"}
          position={{ lat: tempMarker.latitude, lng: tempMarker.longitude }}
          onClick={() => setTempMarker?.(null)}
        />
      )}

      {selectedMarker && (
        <InfoWindow
          position={{
            lat: selectedMarker.latitude,
            lng: selectedMarker.longitude,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-black">
              {selectedMarker.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 mr-2  w-64">
              {selectedMarker.address || "dirección no encontrada"}
            </p>
            <div className="flex gap-2 mb-3 mr-3">
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.latitude},${selectedMarker.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black  font-medium text-base pt-1 flex items-center justify-center border border-black shadow-cartoon-small-xs rounded-lg pr-2 transition-all active:scale-95"
              >
                <GoogleMapsIcon className="size-8 text-white" />
                Google Maps
              </Link>
              <Link
                href={`https://waze.com/ul?ll=${selectedMarker.latitude},${selectedMarker.longitude}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black  font-medium text-base pt-1 flex gap-2 items-center justify-center border border-black shadow-cartoon-small-xs rounded-lg px-3 transition-all active:scale-95"
              >
                <WazeIcon className="size-5" />
                Waze
              </Link>
            </div>
            <Button
              variant={"default"}
              className="absolute top-0 right-0"
              onClick={() => setSelectedMarker(null)}
            >
              <X />
            </Button>
          </div>
        </InfoWindow>
      )}

      {/* Botón flotante para añadir un nuevo punto */}
      {tempMarker && (
        <div className="absolute items-center space-x-4 mx-4 bottom-2 -left-1">
          <Button
            variant={"outline"}
            className="dark:shadow-cartoon-small-xs"
            onClick={() => onModalOpen?.(true)}
            type="button"
          >
            <Plus />
            Añadir punto
          </Button>
        </div>
      )}

      {/* Botón flotante para abrir la ruta en Google Maps */}
      {markers.length >= 1 && (
        <div className="absolute items-center space-x-4 mx-4 bottom-2 -right-1">
          <Link
            className="flex gap-1 text-dark text-lg px-2 py-1 transition-all hover:scale-110 active:scale-95 rounded-xl border border-black shadow-cartoon-small-xs  bg-white dark:text-black"
            href={`https://www.google.com/maps/dir/${markers
              .map((p) => `${p.latitude},${p.longitude}`)
              .join("/")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir Ruta
            <GoogleMapsIcon className="size-7 bg-transparent text-white" />
          </Link>
        </div>
      )}
    </GoogleMap>
  );
};

export default Map;
