import POSLayout from "@/components/POSLayout";
import NotaCreditoDialog from "@/components/dialogs/NotaCreditoDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus } from "lucide-react";

export default function NotasCredito() {
  const [notaCreditoDialogOpen, setNotaCreditoDialogOpen] = useState(false);
  const { data: notas, isLoading } = trpc.notasCredito.listar.useQuery();

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notas de Crédito</h1>
            <p className="text-gray-500 mt-1">Gestión de devoluciones y notas de crédito</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Nota
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Venta</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notas?.map((nota: any) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">{nota.numeroNota}</TableCell>
                    <TableCell>#{nota.ventaId}</TableCell>
                    <TableCell>{nota.motivo}</TableCell>
                    <TableCell>L {nota.monto.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        nota.estado === 'aplicada' ? 'bg-green-100 text-green-800' :
                        nota.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {nota.estado}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(nota.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          )}
      <NotaCreditoDialog open={notaCreditoDialogOpen} onOpenChange={setNotaCreditoDialogOpen} />
        </Card>
      </div>
    </POSLayout>
  );
}
