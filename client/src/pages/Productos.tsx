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
import { toast } from "sonner";
import ProductoDialog from "@/components/dialogs/ProductoDialog";

export default function Productos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState<number | undefined>();

  const { data: productos, isLoading } = trpc.productos.getAll.useQuery({
    search: searchQuery,
    activo: true,
    limit: 100,
  });

  return (
    <POSLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
            <p className="text-sm text-gray-500">Gestión de inventario</p>
          </div>
          <Button onClick={() => { setSelectedProductoId(undefined); setShowDialog(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : productos && productos.length > 0 ? (
                productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      {producto.imagen ? (
                        <img src={producto.imagen} alt={producto.nombre} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{producto.codigo}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.categoria || "-"}</TableCell>
                    <TableCell className="text-right">L {(producto.costo || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      L {producto.precio.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          producto.stock <= (producto.stockMinimo || 0)
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {producto.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedProductoId(producto.id); setShowDialog(true); }}>
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table></div>
        </div>
      </div>

      <ProductoDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        productoId={selectedProductoId}
      />
    </POSLayout>
  );
}
