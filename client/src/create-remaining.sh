#!/bin/bash

# ProductoDialog
cat > components/dialogs/ProductoDialog.tsx << 'EOF'
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ProductoDialogProps {
  open: boolean;
  onClose: () => void;
  productoId?: number;
}

export default function ProductoDialog({ open, onClose, productoId }: ProductoDialogProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    categoria: "",
    costo: "",
    precio: "",
    stock: "",
    stockMinimo: "",
  });

  const utils = trpc.useUtils();
  const { data: producto } = trpc.productos.getById.useQuery(
    { id: productoId! },
    { enabled: !!productoId }
  );

  const crearProducto = trpc.productos.create.useMutation({
    onSuccess: () => {
      toast.success("Producto creado exitosamente");
      utils.productos.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear producto");
    },
  });

  const actualizarProducto = trpc.productos.update.useMutation({
    onSuccess: () => {
      toast.success("Producto actualizado exitosamente");
      utils.productos.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar producto");
    },
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo,
        nombre: producto.nombre,
        categoria: producto.categoria || "",
        costo: producto.costo?.toString() || "",
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        stockMinimo: producto.stockMinimo?.toString() || "",
      });
    } else {
      setFormData({
        codigo: "",
        nombre: "",
        categoria: "",
        costo: "",
        precio: "",
        stock: "",
        stockMinimo: "",
      });
    }
  }, [producto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      codigo: formData.codigo,
      nombre: formData.nombre,
      categoria: formData.categoria || null,
      costo: parseFloat(formData.costo) || null,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      stockMinimo: parseInt(formData.stockMinimo) || null,
      activo: true,
    };

    if (productoId) {
      actualizarProducto.mutate({ id: productoId, ...data });
    } else {
      crearProducto.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{productoId ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="codigo">Código *</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costo">Costo</Label>
              <Input
                id="costo"
                type="number"
                step="0.01"
                value={formData.costo}
                onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="precio">Precio *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={crearProducto.isPending || actualizarProducto.isPending}
            >
              {crearProducto.isPending || actualizarProducto.isPending
                ? "Guardando..."
                : productoId
                ? "Actualizar"
                : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
EOF

# ClienteDialog
cat > components/dialogs/ClienteDialog.tsx << 'EOF'
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ClienteDialogProps {
  open: boolean;
  onClose: () => void;
  clienteId?: number;
}

export default function ClienteDialog({ open, onClose, clienteId }: ClienteDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    rtn: "",
    telefono: "",
    email: "",
    direccion: "",
    nivel: "bronce" as "bronce" | "plata" | "oro" | "platino",
    descuento: "",
    credito: "",
  });

  const utils = trpc.useUtils();
  const { data: cliente } = trpc.clientes.getById.useQuery(
    { id: clienteId! },
    { enabled: !!clienteId }
  );

  const crearCliente = trpc.clientes.create.useMutation({
    onSuccess: () => {
      toast.success("Cliente creado exitosamente");
      utils.clientes.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear cliente");
    },
  });

  const actualizarCliente = trpc.clientes.update.useMutation({
    onSuccess: () => {
      toast.success("Cliente actualizado exitosamente");
      utils.clientes.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar cliente");
    },
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre,
        rtn: cliente.rtn || "",
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        direccion: cliente.direccion || "",
        nivel: (cliente.nivel as any) || "bronce",
        descuento: cliente.descuento?.toString() || "",
        credito: cliente.credito?.toString() || "",
      });
    } else {
      setFormData({
        nombre: "",
        rtn: "",
        telefono: "",
        email: "",
        direccion: "",
        nivel: "bronce",
        descuento: "",
        credito: "",
      });
    }
  }, [cliente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nombre: formData.nombre,
      rtn: formData.rtn || null,
      telefono: formData.telefono || null,
      email: formData.email || null,
      direccion: formData.direccion || null,
      nivel: formData.nivel,
      descuento: parseFloat(formData.descuento) || null,
      credito: parseFloat(formData.credito) || null,
      activo: true,
    };

    if (clienteId) {
      actualizarCliente.mutate({ id: clienteId, ...data });
    } else {
      crearCliente.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{clienteId ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="rtn">RTN</Label>
            <Input
              id="rtn"
              value={formData.rtn}
              onChange={(e) => setFormData({ ...formData, rtn: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="nivel">Nivel</Label>
            <Select value={formData.nivel} onValueChange={(v: any) => setFormData({ ...formData, nivel: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronce">Bronce</SelectItem>
                <SelectItem value="plata">Plata</SelectItem>
                <SelectItem value="oro">Oro</SelectItem>
                <SelectItem value="platino">Platino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="descuento">Descuento (%)</Label>
              <Input
                id="descuento"
                type="number"
                step="0.01"
                value={formData.descuento}
                onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="credito">Crédito (L)</Label>
              <Input
                id="credito"
                type="number"
                step="0.01"
                value={formData.credito}
                onChange={(e) => setFormData({ ...formData, credito: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={crearCliente.isPending || actualizarCliente.isPending}
            >
              {crearCliente.isPending || actualizarCliente.isPending
                ? "Guardando..."
                : clienteId
                ? "Actualizar"
                : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
EOF

# Historial de Ventas
cat > pages/Ventas.tsx << 'EOF'
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
          <Table>
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
                      <TableCell className="text-right">L {venta.impuesto.toFixed(2)}</TableCell>
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
          </Table>
        </div>
      </div>
    </POSLayout>
  );
}
EOF

echo "✅ Archivos creados"
