"use client";

// React and Hooks
import React, { useEffect, useState } from "react";

// Google Maps API
import { useJsApiLoader } from "@react-google-maps/api";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Modal from "@/components/ui/modal";

// Icons
import {
  Earth,
  LocateFixed,
  MapPin,
  MapPinned,
  Trash,
} from "lucide-react";

// Animations
import { AnimatePresence, motion } from "framer-motion";

// Types
import { Marker } from "@/types";

// Custom Components
import SearchBarDirection from "./_components/search-bar-direction";
import Map from "./_components/map";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { travelModes } from "@/lib/travelModesConfig";

const MapPage: React.FC = () => {
  const [showModalNewMarker, setShowModalNewMarker] = useState(false);
  const [errorNameMessage, setErrorNameMessage] = useState<string>("");
  const [currentMarker, setCurrentMarker] = useState<Marker | undefined>();
  const [confirmDeleting, setConfirmDeleting] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([
    {
      nombre: "Parque de la 93",
      latitud: 4.676054,
      longitud: -74.048073,
      direccion: "Calle 93A #13-25, Bogotá, Colombia",
    },
    {
      nombre: "Zona T",
      latitud: 4.668889,
      longitud: -74.052358,
      direccion: "Carrera 12a #83-61, Bogotá, Colombia",
    },
    {
      nombre: "Andino Shopping Mall",
      latitud: 4.667423,
      longitud: -74.051736,
      direccion: "Carrera 11 #82-71, Bogotá, Colombia",
    },
    {
      nombre: "Museo Nacional de Colombia",
      latitud: 4.615734,
      longitud: -74.070243,
      direccion: "Carrera 7 #28-66, Bogotá, Colombia",
    },
    {
      nombre: "Monserrate",
      latitud: 4.605965,
      longitud: -74.058094,
      direccion: "Cerro de Monserrate, Bogotá, Colombia",
    },
  ]);
  const [tempMarker, setTempMarker] = useState<Marker | null>(null);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 5.051976778133077,
    lng: -75.49279797287063,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedTravelMode, setSelectedTravelMode] =
    useState<string>("DRIVING");

  type TravelMode = google.maps.TravelMode;


  useEffect(() => {
    if (locationPermission) {
      // Si el usuario activa la geolocalización, obtener su ubicación
      const options = {
        enableHighAccuracy: true, // Mayor precisión
        timeout: 10000, // Máximo 10 segundos para obtener la ubicación
        maximumAge: 0, // Evita usar ubicaciones en caché
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setDefaultCenter({
            lat: latitude,
            lng: longitude,
          });

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            {
              location: { lat: latitude, lng: longitude },
            },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                setTempMarker({
                  nombre: "",
                  latitud: latitude,
                  longitud: longitude,
                  direccion: results[0].formatted_address,
                });
              } else {
                console.error("Geocode error: ", status);
                setTempMarker({
                  nombre: "",
                  latitud: latitude,
                  longitud: longitude,
                  direccion: "",
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
              console.log(
                "Tiempo de espera agotado para obtener la ubicación."
              );
              break;
            default:
              console.log("Error desconocido al obtener la ubicación.");
          }
        },
        options
      );
    }
  }, [locationPermission]);


  const handleModeChange = (mode: string) => {
    setSelectedTravelMode(mode as TravelMode);
  };

  const fetchDeletingMarker = async (nombre: string | undefined) => {
    try {
      if (nombre) {
        setMarkers(
          markers.filter((Marker: Marker) => Marker.nombre !== nombre)
        );
      }
      setConfirmDeleting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDeleteMarker = (current: Marker) => {
    setConfirmDeleting(true);
    setCurrentMarker(current);
  };

  const handleOpenModalNewMarker = () => {
    if (!tempMarker) return;

    setShowModalNewMarker(true);
  };

  const handleAddMarker = () => {
    if (!tempMarker) return;

    if (!tempMarker.nombre) {
      setErrorNameMessage("El Nombre es obligatorio.");
      return;
    }

    const nameExists = markers.some(
      (marker) => marker.nombre === tempMarker.nombre
    );
    if (nameExists) {
      setErrorNameMessage("El Nombre ya existe. Por favor, elige otro nombre.");
      return;
    }

    setMarkers([...markers, tempMarker]);
    setTempMarker(null);
    setShowModalNewMarker(false);
  };

  const requestLocationPermission = () => {
    setLocationPermission(true);
  };

  const handleSearchResult = (
    result: {
      nombre: string;
      latitud: number;
      longitud: number;
      duracion: string;
    } | null
  ) => {
    if (result) {
      setTempMarker(result);
    }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-screen ">
        <div className="font-semibold text-2xl">Cargando mapa...</div>
        <Earth className="size-20 text-secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4">
        <Card className="lg:order-1 order-2 overflow-y-scroll h-[80vh] md:h-[95vh]">
          <CardContent className="space-y-4 ">
            <Label className="flex gap-2">
              <MapPinned />
              Puntos
            </Label>
            {markers.length > 0 ? (
              <AnimatePresence>
                {markers.map((marker, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent>
                        <h3 className="text-xl font-semibold mb-2 flex gap-2 text-secondary pr-5">
                          <MapPin />
                          {marker.nombre}
                        </h3>
                        <Separator className="relative bg-primary/50 my-3" />
                        <div className="flex gap-2 mb-2">
                          <p className="text-wrap break-words w-1/2">
                            <strong>Latitud:</strong> {marker.latitud}
                          </p>
                          <p className="text-wrap break-words w-1/2">
                            <strong>Longitud:</strong> {marker.longitud}
                          </p>
                        </div>
                        {marker.direccion && (
                          <p>
                            <strong>Dirección:</strong> {marker.direccion}
                          </p>
                        )}
                        <Trash
                          className="absolute top-3 right-3 size-8 p-1 rounded-lg shadow-cartoon-small-xs dark:shadow-cartoon-small-xs-dark cursor-pointer border border-primary  bg-destructive text-white hover:scale-110 transition-all"
                          onClick={() => handleOpenDeleteMarker(marker)}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <p className="text-primary text-base md:text-xl text-center mt-4 border-2 border-dashed py-3 rounded-lg">
                No hay puntos creados aún.
              </p>
            )}
          </CardContent>
        </Card>
        <div className="w-full lg:order-2 order-1">
          <div className="flex flex-wrap justify-between gap-3 md:gap-4 pb-3">
            {/* Primera fila: Buscador y Controles */}
            <div className="flex flex-1 items-center gap-3 w-full">
              {/* Buscador */}
              <div className="flex w-full">
                <SearchBarDirection
                  onSearchResult={handleSearchResult}
                  onLocationUpdate={(lat: number, lng: number) =>
                    setDefaultCenter({ lat, lng })
                  }
                />
              </div>

              {/* Botones de Geolocalización y Tema */}
              <div className="flex gap-2">
                <Button variant={"ghost"} onClick={requestLocationPermission}>
                  <LocateFixed />
                  <span className="sm:block hidden">Tu Ubicación</span>
                </Button>
                <ThemeToggle />
              </div>
            </div>

            {/* Segunda fila: Tabs */}
            <div className="w-full xl:w-auto">
              <Tabs
                value={selectedTravelMode}
                onValueChange={handleModeChange}
                className="w-full"
              >
                <TabsList className="w-full md:w-auto h-14 sm:h-auto">
                  {travelModes.map((mode) => (
                    <TabsTrigger
                      key={mode.value}
                      value={mode.value}
                      className="flex items-center sm:gap-1 sm:flex-row flex-col"
                    >
                      {mode.icon}
                      {mode.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className=" md:mx-0 border border-black shadow-cartoon-small dark:shadow-cartoon-small-dark rounded-lg">
            {/* Map */}
            <Map
              defaultCenter={defaultCenter}
              markers={markers}
              tempMarker={tempMarker}
              setTempMarker={setTempMarker}
              zoom={14}
              zoomShowInfoDistance={14}
              onModalOpen={handleOpenModalNewMarker}
              travelMode={selectedTravelMode}
            />
          </div>
        </div>
      </div>

      {/* Add marker name modal */}
      <Modal
        openModal={showModalNewMarker}
        setShowModal={setShowModalNewMarker}
      >
        <h2 className="text-2xl md:text-3xl text-primary font-semibold">
          Nuevo Punto
        </h2>
        <Separator className="my-3" />
        <div className="my-2">
          <p className="text-muted-foreground mb-3">
            Indica el nombre de el punto seleccionado
          </p>

          <div className="space-y-1">
            <Label>Nombre </Label>
            <Input
              value={tempMarker?.nombre}
              onChange={(e) => {
                setTempMarker((prev: Marker | null) =>
                  prev ? { ...prev, nombre: e.target.value || "" } : null
                );
                setErrorNameMessage(""); // Limpiar mensaje de error
              }}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddMarker();
              }}
            />
            {errorNameMessage && (
              <p className="text-red-500 text-sm">{errorNameMessage}</p>
            )}
          </div>
          <div className="flex justify-end mt-6 sm:mb-0 mb-6 gap-4">
            <Button
              type="button"
              onClick={() => {
                setShowModalNewMarker(false);
                setErrorNameMessage("");
              }}
              variant={"ghost"}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={"outline"}
              onClick={() => handleAddMarker()}
            >
              Añadir Punto
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirm delete marker */}
      <Modal openModal={confirmDeleting} setShowModal={setConfirmDeleting}>
        <h2 className="text-2xl md:text-3xl text-primary font-semibold">
          Eliminar &quot;{currentMarker?.nombre}&quot;
        </h2>
        <Separator className="my-3" />
        <div className="my-2">
          <p className="text-lg">
            ¿Estás seguro que deseas eliminar este Punto?
          </p>
          <div className="flex my-4 gap-5 justify-end">
            <Button variant={"ghost"} onClick={() => setConfirmDeleting(false)}>
              Cancelar
            </Button>
            <Button
              variant={"destructive"}
              onClick={() =>
                fetchDeletingMarker(currentMarker?.nombre ?? undefined)
              }
            >
              <Trash />
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MapPage;
