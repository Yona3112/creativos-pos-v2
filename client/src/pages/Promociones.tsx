import POSLayout from "@/components/POSLayout";
import PromocionDialog from "@/components/dialogs/PromocionDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, X } from "lucide-react";

export default function Promociones() {
  const [promocionDialogOpen, setPromocionDialogOpen] = useState(false);
  const { data: promociones, isLoading } = trpc.promociones.listarActivas.useQuery();
  const desactivar = trpc.promociones.desactivar.useMutation();

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promociones</h1>
            <p className="text-gray-500 mt-1">Gestión de descuentos y promociones</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Aplica A</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promociones?.map((promo: any) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.nombre}</TableCell>
                    <TableCell className="capitalize">{promo.tipo}</TableCell>
                    <TableCell>
                      {promo.tipo === 'porcentaje' ? `${promo.valor}%` : `L ${promo.valor}`}
                    </TableCell>
                    <TableCell className="capitalize">{promo.aplicaA}</TableCell>
                    <TableCell>
                      {new Date(promo.fechaInicio).toLocaleDateString()} - {new Date(promo.fechaFin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => desactivar.mutate({ id: promo.id })}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          )}
      <PromocionDialog open={promocionDialogOpen} onOpenChange={setPromocionDialogOpen} />
        </Card>
      </div>
    </POSLayout>
  );
}
