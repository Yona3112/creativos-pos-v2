import { useState } from "react";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ClienteDialog from "@/components/dialogs/ClienteDialog";

export default function Clientes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | undefined>();

  const { data: clientes, isLoading } = trpc.clientes.list.useQuery({
    search: searchQuery,
    activo: true,
    limit: 100,
  });

  return (
    <POSLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
            <p className="text-sm text-gray-500">Gestión de clientes y puntos de lealtad</p>
          </div>
          <Button onClick={() => { setSelectedClienteId(undefined); setShowDialog(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nombre, RTN o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabla de clientes */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>RTN</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead className="text-right">Crédito</TableHead>
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
              ) : clientes && clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.rtn || "-"}</TableCell>
                    <TableCell>{cliente.telefono || "-"}</TableCell>
                    <TableCell>{cliente.email || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          cliente.nivel === "platino"
                            ? "bg-purple-100 text-purple-700"
                            : cliente.nivel === "oro"
                            ? "bg-yellow-100 text-yellow-700"
                            : cliente.nivel === "plata"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {cliente.nivel || "bronce"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      L {(cliente.credito || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedClienteId(cliente.id); setShowDialog(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table></div>
        </div>
      </div>

      <ClienteDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        clienteId={selectedClienteId}
      />
    </POSLayout>
  );
}
