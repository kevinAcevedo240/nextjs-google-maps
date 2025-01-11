
import ClientPage from "./[client]/page";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <ClientPage />
      <Toaster />
    </>
  );
}
