import { BikeIcon, FootprintsIcon, CarFront, Bus } from "lucide-react";

export const travelModes = [
       {
         value: "BICYCLING",
         label: "Bicicleta",
         icon: <BikeIcon className="size-3 sm:size-4" />,
       },
       {
         value: "WALKING",
         label: "Caminar",
         icon: <FootprintsIcon className="size-3 sm:size-4" />,
       },
       {
         value: "DRIVING",
         label: "Carro",
         icon: <CarFront className="size-3 sm:size-4" />,
       },
       {
         value: "TRANSIT",
         label: "Bus",
         icon: <Bus className="size-3 sm:size-4" />,
       },
     ];
