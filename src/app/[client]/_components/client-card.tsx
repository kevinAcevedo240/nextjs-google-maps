import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Client } from "@/types/client";
import { IdCard } from "lucide-react";
import React from "react";

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Card className="shadow-cartoon-small dark:shadow-cartoon-small-dark">
      <CardContent>
        <div className="flex flex-col justify-start items-start gap-1 my-3">
          <div className="flex gap-2 items-center">
            <IdCard size={24} />
            <Label>Identificacion: </Label>
          </div>
          <h2 className="text-base">{client.identityCard}</h2>
        </div>
        <p className="text-base md:text-xl flex justify-start items-center flex-col gap-1">
          Maiz comprado:{" "}
          <span className="text-2xl md:text-3xl">{client.salesCount}🌽</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
