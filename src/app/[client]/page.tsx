"use client";

// React and Hooks
import React, { useState } from "react";

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
import { Earth, MapPinned, Trash } from "lucide-react";

// Animations
import { AnimatePresence } from "framer-motion";

// Types
import { Marker } from "@/types";

// Custom Components
import SearchBarDirection from "@/app/[client]/_components/search-bar-direction";
import Map from "@/app/[client]/_components/map";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { travelModes } from "@/lib/travelModesConfig";
import MarkerCard from "@/app/[client]/_components/marker-card";
import CurrentLocation from "@/app/[client]/_components/current-location";

const MapPage: React.FC = () => {
  const [showModalNewMarker, setShowModalNewMarker] = useState(false);
  const [errorNameMessage, setErrorNameMessage] = useState<string>("");
  const [currentMarker, setCurrentMarker] = useState<Marker | undefined>();
  const [confirmDeleting, setConfirmDeleting] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([
    {
      name: "Parque de la 93",
      latitude: 4.676054,
      longitude: -74.048073,
      address: "Calle 93A #13-25, Bogotá, Colombia",
    },
    {
      name: "Zona T",
      latitude: 4.668889,
      longitude: -74.052358,
      address: "Carrera 12a #83-61, Bogotá, Colombia",
    },
    {
      name: "Centro Comercial Andino",
      latitude: 4.667423,
      longitude: -74.051736,
      address: "Carrera 11 #82-71, Bogotá, Colombia",
    },
    {
      name: "Museo Nacional de Colombia",
      latitude: 4.615734,
      longitude: -74.070243,
      address: "Carrera 7 #28-66, Bogotá, Colombia",
    },
    {
      name: "Monserrate",
      latitude: 4.605965,
      longitude: -74.058094,
      address: "Cerro de Monserrate, Bogotá, Colombia",
    },
  ]);
  const [tempMarker, setTempMarker] = useState<Marker | null>(null);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 5.051976778133077,
    lng: -75.49279797287063,
  });
  const [selectedTravelMode, setSelectedTravelMode] =
    useState<string>("DRIVING");

  type TravelMode = google.maps.TravelMode;

  const handleModeChange = (mode: string) => {
    setSelectedTravelMode(mode as TravelMode);
  };

  const fetchDeletingMarker = async (name: string | undefined) => {
    try {
      if (name) {
        setMarkers(markers.filter((Marker: Marker) => Marker.name !== name));
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

  const handleAddMarker = () => {
    if (!tempMarker) return;

    if (!tempMarker.name) {
      setErrorNameMessage("El Nombre es obligatorio.");
      return;
    }

    const nameExists = markers.some(
      (marker) => marker.name === tempMarker.name
    );
    if (nameExists) {
      setErrorNameMessage("El Nombre ya existe. Por favor, elige otro nombre.");
      return;
    }

    setMarkers([...markers, tempMarker]);
    setTempMarker(null);
    setShowModalNewMarker(false);
  };

  const handleCurrentLocation = (data: Marker) => {
    setDefaultCenter({
      lat: data.latitude,
      lng: data.longitude,
    });

    setTempMarker(data);
  };

  const handleSearchResult = (result: Marker | null) => {
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
        <div className="font-semibold text-2xl animate-pulse">
          Cargando mapa...
        </div>
        <Earth className="size-20 text-secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4">
        <Card className="lg:order-1 order-2 overflow-y-scroll h-[80vh] md:h-[95vh]">
          <CardContent className="space-y-4 px-4">
            <Label className="flex gap-2">
              <MapPinned />
              Puntos
            </Label>
            {markers.length > 0 ? (
              <AnimatePresence>
                {markers.map((marker, index) => (
                  <MarkerCard
                    marker={marker}
                    key={index}
                    onDelete={handleOpenDeleteMarker}
                  />
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
          <div className="flex flex-wrap  gap-3 pb-3">
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
                <CurrentLocation onLocationUpdate={handleCurrentLocation} />
                <ThemeToggle />
              </div>
            </div>

            {/* Segunda fila: Tabs */}
            <div className="w-full xl:w-auto">
              <Tabs value={selectedTravelMode} onValueChange={handleModeChange}>
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

          <Map
            defaultCenter={defaultCenter}
            markers={markers}
            tempMarker={tempMarker}
            setTempMarker={setTempMarker}
            zoom={14}
            zoomShowInfoDistance={14}
            onModalOpen={() => setShowModalNewMarker(true)}
            travelMode={selectedTravelMode}
          />
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
              value={tempMarker?.name}
              onChange={(e) => {
                setTempMarker((prev: Marker | null) =>
                  prev ? { ...prev, name: e.target.value || "" } : null
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
          Eliminar &quot;{currentMarker?.name}&quot;
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
                fetchDeletingMarker(currentMarker?.name ?? undefined)
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
