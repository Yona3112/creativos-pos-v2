import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { FileText } from "lucide-react";

export default function LibrosSAR() {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  
  const { data: libro, isLoading } = trpc.librosSAR.obtenerLibroVentas.useQuery({
    fechaInicio,
    fechaFin
  });

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Libros SAR</h1>
            <p className="text-gray-500 mt-1">Registro contable para SAR Honduras</p>
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-x-auto"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>RTN</TableHead>
                  <TableHead>Exentas</TableHead>
                  <TableHead>Gravadas 15%</TableHead>
                  <TableHead>ISV 15%</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {libro?.map((registro: any) => (
                  <TableRow key={registro.id}>
                    <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{registro.numeroFactura}</TableCell>
                    <TableCell>{registro.clienteNombre}</TableCell>
                    <TableCell>{registro.clienteRTN || "N/A"}</TableCell>
                    <TableCell>L {registro.exentas.toFixed(2)}</TableCell>
                    <TableCell>L {registro.gravadas15.toFixed(2)}</TableCell>
                    <TableCell>L {registro.isv15.toFixed(2)}</TableCell>
                    <TableCell className="font-bold">L {registro.total.toFixed(2)}</TableCell>
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
