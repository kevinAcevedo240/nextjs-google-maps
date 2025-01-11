'use client';
import {  useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import ClientCard from './client-card';
import { Client } from '@/types/client';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wheat } from 'lucide-react';

export default function CornShop() {
  const [cornCount, setCornCount] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentIdentifier, setCurrentIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  const initialClients: Client[] = [
    { salesCount: 5, identityCard: '12345' },
    { salesCount: 3, identityCard: '67890' },
    { salesCount: 8, identityCard: '54321' },
  ];

  useEffect(() => {
    setIsLoading(true);
    setClients(initialClients);
    setCornCount(initialClients.reduce((acc, client) => acc + client.salesCount, 0));
    setIsLoading(false);
  }, []);

  const buyCorn = async () => {

    if (!currentIdentifier.trim()) {
      toast.error("Por favor ingresa una identificación válida.", {
        className: "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
      });
      return;
    }

    try {

      setCornCount(prevCount => prevCount + 1);

      setClients(prevClients => {
        const existingClient = prevClients.find(client => client.identityCard === currentIdentifier);
        if (existingClient) {
          return prevClients.map(client =>
            client.identityCard === currentIdentifier
              ? { ...client, salesCount: client.salesCount + 1 }
              : client
          );
        } else {
          return [...prevClients, { identityCard: currentIdentifier, salesCount: 1 }];
        }
      });
      toast.success("Compra exitosa", {
        className: "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
        description: "Has comprado 1 maiz 🌽",
       
      });

    } catch (error) {
      console.error("Error buying corn:", error);
      toast.error("Error comprando maiz", {
        className: "text-lg border border-primary shadow-cartoon-small-xs dark:shadow-cartoon-small-dark dark:border-black",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 w-full xl:w-2/3 items-center">
      <p className="text-2xl flex justify-center items-center">
        Total maiz comprado: {cornCount}{" "}
        <span className="text-4xl z-10">🌽</span>
      </p>
      <Card className="relative w-full lg:w-1/2 text-center justify-center py-2 group overflow-hidden">
        <CardContent>
          <div className="flex  items-end gap-4">
            <div className="flex flex-col gap-2 w-full mt-2 items-start">
              <Label>Ingresa tu identificacion</Label>
              <Input
                type="text"
                placeholder="Identificacion"
                value={currentIdentifier}
                onChange={(e) => setCurrentIdentifier(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    buyCorn();
                  }
                }}
              />
            </div>

            <Button
              variant="outline"
              className="w-[90%] sm:w-1/2 h-full text-xl gap-3 group/button transition-all duration-300 z-10"
              onClick={buyCorn}
            >
              Comprar Maiz
              <Wheat />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <AnimatePresence>
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  className="p-4 space-y-2 animate-pulse h-40 shadow-cartoon-small"
                >
                  <div className="h-4 w-1/3 bg-gray-200 rounded col-span-3"></div>
                  <div className="h-3 bg-gray-200 rounded col-span-3"></div>
                  <div className="flex flex-col justify-center items-center gap-1 pt-3">
                    <div className="h-4 w-2/3 bg-gray-200 rounded col-span-3 text-center"></div>
                    <div className="flex justify-center items-center gap-2 mt-3">
                      <div className="h-8 w-16 bg-gray-300 rounded-lg  "></div>
                      <span className="text-2xl ">🌽</span>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          ) : (
             clients.map((client) => (
               <motion.div
                 key={client.identityCard}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3 }}
               >
                 <ClientCard key={client.identityCard} client={client} />
               </motion.div>
             ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
