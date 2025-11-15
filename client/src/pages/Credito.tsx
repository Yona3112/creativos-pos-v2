import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { DollarSign } from "lucide-react";

export default function Credito() {
  const { data: creditos, isLoading } = trpc.credito.listarPendientes.useQuery();
  const registrarPago = trpc.credito.registrarPago.useMutation();

  return (
    <POSLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ventas a Crédito</h1>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditos?.map((credito: any) => (
                  <TableRow key={credito.id}>
                    <TableCell className="font-medium">Cliente #{credito.clienteId}</TableCell>
                    <TableCell>L {credito.montoTotal.toFixed(2)}</TableCell>
                    <TableCell>L {credito.montoPagado.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-red-600">L {credito.saldo.toFixed(2)}</TableCell>
                    <TableCell>{new Date(credito.fechaVencimiento).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        credito.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                        credito.estado === 'vencido' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {credito.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          const monto = prompt("Monto del pago:");
                          if (monto) {
                            registrarPago.mutate({
                              ventaCreditoId: credito.id,
                              monto: parseFloat(monto),
                              metodoPago: "efectivo"
                            });
                          }
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Pagar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          )}
        </Card>
      </div>
    </POSLayout>
  );
}
