
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ClientPage from "./[client]/page";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <ClientPage />
      <Toaster />
    </>
  );
}
