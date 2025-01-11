'use client'

import React, { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// import DataTable from "@/components/shared/dataTable/data-table";
import { Button } from "@/components/ui/button";
import { LocateFixed, MapPin, MapPinned, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// import { AsignacionNovedadesTableColumns } from "@/modules/rutas/adapters/columns-novedades";
import { AnimatePresence, motion } from "framer-motion";
import { Marker } from "@/types";
import Modal from "@/components/ui/modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import SearchBarDirection from "./_components/search-bar-direction";
import MapComponent from "./_components/map";


const MapForm: React.FC= () => {
  const [showModalAlert, setShowModaAlert] = useState(false);
  const [showModalNewPoint, setShowModalNewPoint] = useState(false);
  const [directionSearch, setDirectionSearch] = useState<string>("");
  const [errorNameMessage, setErrorNameMessage] = useState<string>("");
  const [currentPoint, setcurrentPoint] = useState<Marker | undefined>();
  const [confirmDeleting, setConfirmDeleting] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [tempMarker, setTempMarker] = useState<Marker | null>(null);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 5.051976778133077,
    lng: -75.49279797287063,
  });
  const [locationPermission, setLocationPermission] = useState(false);

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
  }, [ locationPermission]);

  const fetchDeletingMarker = async (nombre: string | undefined) => {
    try {
      if (nombre) {
        setMarkers(markers.filter((Marker: Marker) => Marker.nombre !== nombre));
      }
      setConfirmDeleting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDeletePoint = (current: Marker) => {
    setConfirmDeleting(true);
    setcurrentPoint(current);
  };


  const handleOpenModalNewMarker = () => {
    if (!tempMarker) return;

    setShowModalNewPoint(true);
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
    setShowModalNewPoint(false);
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

  const handleSearchError = (query: string) => {
    setDirectionSearch(query);
    setShowModaAlert(true);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div className="font-semibold text-2xl">Cargando mapa...</div>;
  }

  return (
    <>
      <div className=" flex lg:flex-row flex-col gap-4">
        
        <Card className="bg-white lg:h-[95vh] dark:bg-black/30 rounded-lg border-black/10 pt-4 overflow-auto  lg:w-1/3  md:mx-0 md:mb-0  lg:order-1 order-2 z-10 border border-black dark:border-white shadow-cartoon-small dark:shadow-cartoon-small-dark ">
          <CardContent className=" space-y-5">
            <Label className="text-xl my-3 flex gap-2">
              <MapPinned />
              Markers
            </Label>
            {markers.length > 0 && (
              <>
                <AnimatePresence>
                  {markers.map((marker, index) => (
                    <motion.div
                      key={index} // Asegúrate de usar un ID único si es posible
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white dark:bg-black/30 mb-4 rounded-lg border border-black dark:border-white pt-2 shadow-cartoon-small dark:shadow-cartoon-small-dark relative">
                        <CardContent>
                          <h3 className="text-xl font-semibold mb-2 flex gap-2">
                            <MapPin />
                            {marker.nombre}
                          </h3>
                          <Separator className="relative bg-black/30 my-3 dark:bg-white " />
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
                            className="absolute top-3 right-3 cursor-pointer text-destructive hover:scale-110 transition-all"
                            onClick={() => handleOpenDeletePoint(marker)}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Separator className="relative bg-black/40 dark:bg-white " />
              </>
            )}
          </CardContent>
        </Card>
        <div className="w-full lg:order-2 order-1">
          {/* Buscador */}
          <div className=" justify-between gap-3 md:gap-6 pb-3 flex">
            <div className="w-full  ">
              <SearchBarDirection
                onSearchResult={handleSearchResult}
                onSearchError={handleSearchError}
                onLocationUpdate={(lat: number, lng: number) =>
                  setDefaultCenter({ lat, lng })
                }
              />
            </div>

            <div className="flex gap-2">
              {/* Botón para activar geolocalización */}
              <Button
                variant={"outline"}
                // className="dark:text-black  ml-0 sm:ml-2 md:mx-0 text-white text-lg p-3 sm:p-4 transition-all hover:scale-110 active:scale-95 rounded-lg dark:bg-white dark:hover:shadow-custom-white hover:bg-black hover:text-white bg-black"
                onClick={requestLocationPermission}
              >
                <LocateFixed className="sm:mr-2" />
                <span className="sm:block hidden">Tu Ubicación</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <div className=" md:mx-0 border border-black shadow-cartoon-small rounded-lg">
            {/* Mapa */}
            <MapComponent
              defaultCenter={defaultCenter}
              markers={markers}
              tempMarker={tempMarker}
              setTempMarker={setTempMarker}
              zoom={14}
              zoomShowInfoDistance={14}
              theme="light"
              enableAddMarker={true}
              onModalOpen={handleOpenModalNewMarker}
            />
          </div>
        </div>
      </div>

      {/* modal alert direction not found */}
      <Modal
        openModal={showModalAlert}
        setShowModal={setShowModaAlert}
        maxWidth="md:max-w-[50%] xl:max-w-[30%]"
      >
        <h2 className="text-2xl md:text-3xl text-neutral-600 dark:text-white font-bold text-center mb-4 max-w-xl">
          Mapa Dirección{" "}
        </h2>
        <Separator
          className={"relative bg-border mb-3 dashboard-header-highlight"}
        />
        <div className="my-2">
          <p className="text-lg">
            La dirección {directionSearch} no fue encontrada en el mapa
          </p>
          <div className="flex my-4 gap-5">
            <Button
              className="border bg-black/70 p-2 border-black/80 text-white hover:bg-black hover:scale-110 transform transition-all ease-in-out text-lg"
              onClick={() => setShowModaAlert(false)}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add marker name modal */}
      <Modal
        openModal={showModalNewPoint}
        setShowModal={setShowModalNewPoint}
        maxWidth="md:max-w-[50%] xl:max-w-[30%]"
      >
        <h2 className="text-2xl md:text-3xl text-neutral-600 dark:text-white font-bold text-center mb-4 max-w-xl">
          Nuevo Marker{" "}
        </h2>
        <Separator
          className={"relative bg-border mb-3 dashboard-header-highlight"}
        />
        <div className="my-2">
          <p className="text-muted-foreground mb-3">
            Indica el nombre de el Marker seleccionado
          </p>

          <div className="space-y-1">
            <Label>Nombre </Label>
            <Input
              value={tempMarker?.nombre}
              onChange={(e) => {
                setTempMarker((prev: Marker | null) =>
                  prev ? { ...prev, nombre: e.target.value || "" } : null
                );
                setErrorNameMessage(""); // Clear error message when typing
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
                setShowModalNewPoint(false);
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
              Añadir Marker
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirm delete marker */}
      <Modal
        openModal={confirmDeleting}
        setShowModal={setConfirmDeleting}
        maxWidth="md:max-w-[50%] xl:max-w-[30%]"
      >
        <h2 className="text-2xl md:text-3xl text-neutral-600 dark:text-white font-bold text-center mb-4 max-w-xl">
          Eliminar{" "}
          <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-black/40 ">
            {currentPoint?.nombre}
          </span>
        </h2>
        <Separator
          className={"relative bg-border mb-3 dashboard-header-highlight"}
        />
        <div className="my-2">
          <p className="text-lg">
            ¿Estás seguro que deseas eliminar este Marker?
          </p>
          <div className="flex my-4 gap-5">
            <Button
              variant={"destructive"}
              onClick={() =>
                fetchDeletingMarker(currentPoint?.nombre ?? undefined)
              }
            >
              <Trash className="mr-2" size={20} />
              Eliminar
            </Button>
            <Button variant={"ghost"} onClick={() => setConfirmDeleting(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MapForm;
