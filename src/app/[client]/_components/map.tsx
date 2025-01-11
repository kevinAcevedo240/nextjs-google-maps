import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import Link from "next/link";
import { CarFront, Plus, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Novedad, Punto } from "@/types";
import GoogleMapsIcon from "@/components/ui/icons/google-maps-icon";
import WazeIcon from "@/components/ui/icons/waze-icon";


interface MapComponentProps {
  defaultCenter: { lat: number; lng: number };
  markers: Punto[];
  novedades?: Novedad[];
  tempMarker?: Punto | null;
  setTempMarker?: React.Dispatch<React.SetStateAction<Punto | null>>;
  zoom: number;
  zoomShowInfoDistance?: number;
  theme: "dark" | "light";
  enableAddMarker?: boolean;
  onModalOpen?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  defaultCenter,
  markers,
  tempMarker,
  setTempMarker,
  novedades,
  zoom,
  zoomShowInfoDistance,
  enableAddMarker = true,
  onModalOpen,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<Punto | null>(null);
  const [selectedNovedad, setSelectedNovedad] = useState<Novedad | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom); // Nivel de zoom inicial
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (markers.length > 1) {
      calculateRoute(); // Calcula la ruta cuando haya al menos 2 puntos
    } else {
      setDirectionsResponse(null); // Resetea la respuesta de direcciones si hay menos de 2 puntos
    }
  }, [markers]);

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
      location: { lat: marker.latitud, lng: marker.longitud },
      stopover: true,
    }));

    try {
      const results = await directionsService.route({
        origin: { lat: markers[0].latitud, lng: markers[0].longitud },
        destination: {
          lat: markers[markers.length - 1].latitud,
          lng: markers[markers.length - 1].longitud,
        },
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      // Actualizar la respuesta de direcciones.
      setDirectionsResponse(results);
    } catch (error) {
      console.error("Error calculando la ruta:", error);
    }
  };

  const handleMapClick: (e: google.maps.MapMouseEvent) => void = (e) => {
    if (!e.latLng) return;

    if (!enableAddMarker) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setTempMarker?.({
          nombre: "",
          latitud: lat,
          longitud: lng,
          duracion: "0",
          direccion: results[0].formatted_address,
        });
      } else {
        console.error("Geocode error: ", status);
        setTempMarker?.({
          nombre: "",
          latitud: lat,
          longitud: lng,
          duracion: "0",
          direccion: "",
        });
      }
    });
  };

  return (
    <GoogleMap
      // mapContainerStyle={{ width: "100%", height: "800px" }}
      center={defaultCenter}
      zoom={currentZoom}
      onClick={handleMapClick}
      onLoad={(map) => setMap(map)}
      onZoomChanged={handleZoomChanged}
      mapContainerClassName="rounded-lg  shadow-custom-black px-3 w-full h-[80vh] lg:h-[90vh]"
      options={{
      fullscreenControl: true,
      zoomControl: false,
      streetViewControl: false,
      disableDefaultUI: false,
        // styles: theme === "dark" ? darkModeStyles : [],
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.latitud, lng: marker.longitud }}
          onClick={() => {
            setSelectedMarker(marker);
          }}
          icon={"/assets/custom-marker.svg"}
        />
      ))}

      {novedades &&
        novedades.map((novedad, index) => (
          <Marker
            key={index}
            position={{ lat: novedad.latitud, lng: novedad.longitud }}
            onClick={() => {
              setSelectedNovedad(novedad);
            }}
            icon={"/assets/warning-marker.svg"}
          />
        ))}

      {directionsResponse && (
        <>
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: true,
              //   suppressMarkers: currentZoom >= 20 ? false : true,
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
                      <CarFront className="size-6" />
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
        <Marker
          icon={"/assets/custom-temp-marker.svg"}
          position={{ lat: tempMarker.latitud, lng: tempMarker.longitud }}
          onClick={() => setTempMarker?.(null)}
        />
      )}

      {selectedMarker && (
        <InfoWindow
          position={{
            lat: selectedMarker.latitud,
            lng: selectedMarker.longitud,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-black">
              {selectedMarker.nombre}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 mr-2  w-64">
              {selectedMarker.direccion || "dirección no encontrada"}
            </p>
            <div className="flex gap-2 mb-3 mr-3">
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.latitud},${selectedMarker.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white font-medium text-base  pt-1 flex items-center justify-center border border-black shadow-cartoon-small-xs rounded-lg pr-2 transition-all active:scale-95"
              >
                <GoogleMapsIcon className="size-8 text-white" />
                Google Maps
              </Link>
              <Link
                href={`https://waze.com/ul?ll=${selectedMarker.latitud},${selectedMarker.longitud}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white font-medium text-base pt-1 flex gap-2 items-center justify-center border border-black shadow-cartoon-small-xs rounded-lg px-3 transition-all active:scale-95"
              >
                <WazeIcon className="size-5" />
                Waze
              </Link>
            </div>
            <Button
              variant={"ghost"}
              className="p-2 text-lg absolute text-muted-foreground top-0 right-0 hover:!bg-white hover:scale-110 transition-all hover:-rotate-[20deg]"
              onClick={() => setSelectedMarker(null)}
            >
              <X className="size-5" />
            </Button>
          </div>
        </InfoWindow>
      )}

      {selectedNovedad && (
        <InfoWindow
          position={{
            lat: selectedNovedad.latitud,
            lng: selectedNovedad.longitud,
          }}
          onCloseClick={() => setSelectedNovedad(null)}
        >
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-black max-w-64 mr-8 flex gap-2 justify-start items-center mb-1">
              <TriangleAlert className="size-5" />
              {selectedNovedad.tipo}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 mr-2  w-64">
              {selectedNovedad.nombre || "dirección no encontrada"}
            </p>
            <div className="flex gap-2 mb-3 mr-3">
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${selectedNovedad.latitud},${selectedNovedad.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white font-medium text-base  pt-1 flex items-center justify-center border border-black shadow-cartoon-small-xs rounded-lg pr-2 transition-all active:scale-95"
              >
                <GoogleMapsIcon className="size-8 text-white" />
                Google Maps
              </Link>
              <Link
                href={`https://waze.com/ul?ll=${selectedNovedad.latitud},${selectedNovedad.longitud}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white font-medium text-base pt-1 flex gap-2 items-center justify-center border border-black shadow-cartoon-small-xs rounded-lg px-3 transition-all active:scale-95"
              >
                <WazeIcon className="size-5" />
                Waze
              </Link>
            </div>
            <Button
              variant={"ghost"}
              className="p-2 text-lg absolute text-muted-foreground top-0 right-0 hover:!bg-white hover:scale-110 transition-all hover:-rotate-[20deg]"
              onClick={() => setSelectedNovedad(null)}
            >
              <X className="size-5" />
            </Button>
          </div>
        </InfoWindow>
      )}

      {enableAddMarker && (
        <div className="absolute items-center space-x-4 mx-4 bottom-2 -left-1">
          <Button
            variant={"ghost"}
            className=" dark:text-black text-black border border-black shadow-cartoon-small-xs text-lg p-3 transition-all hover:scale-110 active:scale-95 rounded-xl bg-white dark:hover:shadow-custom-white hover:bg-white "
            onClick={(e) => {
              e.stopPropagation();
              onModalOpen?.();
            }}
            type="button"
            disabled={!tempMarker}
          >
            <Plus className="mr-2" />
            Añadir punto
          </Button>
        </div>
      )}

      {markers.length >= 1 && (
        <div className="absolute items-center space-x-4 mx-4 bottom-2 -right-1">
          <Link
            className="  flex gap-1 text-dark text-lg p-2 transition-all hover:scale-110 active:scale-95 rounded-xl border border-black shadow-cartoon-small-xs  bg-white dark:text-black"
            href={`https://www.google.com/maps/dir/${markers
              .map((p) => `${p.latitud},${p.longitud}`)
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

export default MapComponent;
