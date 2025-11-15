import { useState } from "react";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Cotizaciones() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: cotizaciones, isLoading } = trpc.cotizaciones.list.useQuery({ limit: 100 });

  return (
    <POSLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cotizaciones</h2>
            <p className="text-sm text-gray-500">Gestión de cotizaciones</p>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" />Nueva Cotización</Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Cargando...</TableCell></TableRow>
              ) : cotizaciones && cotizaciones.length > 0 ? (
                cotizaciones.map((cot) => (
                  <TableRow key={cot.id}>
                    <TableCell className="font-medium">{cot.numero}</TableCell>
                    <TableCell>{new Date(cot.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">L {cot.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        cot.estado === "Aprobada" ? "bg-green-100 text-green-700" :
                        cot.estado === "Rechazada" ? "bg-red-100 text-red-700" :
                        cot.estado === "Convertida" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{cot.estado}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No se encontraron cotizaciones</TableCell></TableRow>
              )}
            </TableBody>
          </Table></div>
        </div>
      </div>
    </POSLayout>
  );
}
