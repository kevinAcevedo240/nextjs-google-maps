
import ClientPage from "./[client]/page";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <div className="m-5">
        <ClientPage />
        <Toaster />
      </div>
    </>
  );
}
