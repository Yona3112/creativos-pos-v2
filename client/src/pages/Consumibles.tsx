import POSLayout from "@/components/POSLayout";
import ConsumibleDialog from "@/components/dialogs/ConsumibleDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus } from "lucide-react";

export default function Consumibles() {
  const [consumibleDialogOpen, setConsumibleDialogOpen] = useState(false);
  const { data: consumibles, isLoading } = trpc.consumibles.listar.useQuery();

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consumibles</h1>
            <p className="text-gray-500 mt-1">Control de productos consumibles</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Consumible
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Cant. por Unidad</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumibles?.map((consumible: any) => (
                  <TableRow key={consumible.id}>
                    <TableCell className="font-medium">Producto #{consumible.productoId}</TableCell>
                    <TableCell>{consumible.unidadMedida}</TableCell>
                    <TableCell>{consumible.cantidadPorUnidad}</TableCell>
                    <TableCell>{consumible.stockActual}</TableCell>
                    <TableCell>{consumible.stockMinimo || "N/A"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        consumible.stockActual <= (consumible.stockMinimo || 0)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {consumible.stockActual <= (consumible.stockMinimo || 0) ? 'Bajo' : 'OK'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          )}
      <ConsumibleDialog open={consumibleDialogOpen} onOpenChange={setConsumibleDialogOpen} />
        </Card>
      </div>
    </POSLayout>
  );
}
