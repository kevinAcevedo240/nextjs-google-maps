
import MapPage from "./[client]/page";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="m-5">
      <MapPage />
      <Toaster />
    </div>
  );
}
