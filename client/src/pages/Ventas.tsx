import { useState } from "react";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Printer } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Ventas() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: ventas, isLoading } = trpc.ventas.list.useQuery({ limit: 100 });

  const handlePrint = (ventaId: number) => {
    window.open(`/factura/${ventaId}`, '_blank');
  };

  return (
    <POSLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historial de Ventas</h2>
            <p className="text-sm text-gray-500">Registro de todas las ventas realizadas</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por número de factura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método Pago</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">ISV</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : ventas && ventas.length > 0 ? (
                ventas
                  .filter((v) =>
                    !searchQuery || v.numeroFactura.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell className="font-medium">{venta.numeroFactura}</TableCell>
                      <TableCell>{new Date(venta.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          {venta.metodoPago}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">L {venta.subtotal.toFixed(2)}</TableCell>
                      <TableCell className="text-right">L {(venta.impuesto || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">L {venta.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handlePrint(venta.id)}>
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No se encontraron ventas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table></div>
        </div>
      </div>
    </POSLayout>
  );
}
