import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Marker } from "@/types";
import { motion } from "framer-motion";
import { MapPin, Trash } from "lucide-react"; 

interface MarkerCardProps {
  marker: Marker;
  onDelete: (marker: Marker) => void;
}

const MarkerCard: React.FC<MarkerCardProps> = ({ marker, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2 flex gap-2 text-secondary pr-5">
            <MapPin />
            {marker.name}
          </h3>
          <Separator className="relative bg-primary/50 my-3" />
          <div className="flex gap-2 mb-2">
            <p className="text-wrap break-words w-1/2">
              <strong>Latitud:</strong> {marker.latitude}
            </p>
            <p className="text-wrap break-words w-1/2">
              <strong>Longitud:</strong> {marker.longitude}
            </p>
          </div>
          {marker.address && (
            <p>
              <strong>Dirección:</strong> {marker.address}
            </p>
          )}
          <Trash
            className="absolute top-3 right-3 size-8 p-1 rounded-lg shadow-cartoon-small-xs dark:shadow-cartoon-small-xs-dark cursor-pointer border border-primary bg-destructive text-white hover:scale-110 transition-all"
            onClick={() => onDelete(marker)}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarkerCard;
