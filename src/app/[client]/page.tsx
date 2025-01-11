import CornShop from "./_components/corn-shop";

export default function ClientPage() {
return (
  <div className="flex flex-col gap-7 min-h-screen items-center justify-center pt-16 pb-8 px-4 ">
    <div className="space-y-3">
      <h1 className="text-4xl md:text-6xl text-center">
        Bienvenido a la tienda de Bob&apos;s Corn 
      </h1>
      <p className="text-lg md:text-2xl text-center">
        Aqui encontraras los mejores productos de maiz de la region
      </p>
    </div>
    <CornShop />
  </div>
);
}

