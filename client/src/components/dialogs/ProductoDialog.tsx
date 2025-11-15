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
    imagen: "",
  });
  const [uploading, setUploading] = useState(false);

  const utils = trpc.useUtils();
  const { data: producto } = trpc.productos.getById.useQuery(
    productoId!,
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
        imagen: producto.imagen || "",
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
        imagen: "",
      });
    }
  }, [producto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      codigo: formData.codigo,
      nombre: formData.nombre,
      categoria: formData.categoria || undefined,
      costo: parseFloat(formData.costo) || undefined,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      stockMinimo: parseInt(formData.stockMinimo) || undefined,
      imagen: formData.imagen || undefined,
      activo: true,
    };

    if (productoId) {
      actualizarProducto.mutate({ id: productoId, data });
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

          <div>
            <Label htmlFor="imagen">Imagen del Producto</Label>
            <Input
              id="imagen"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                setUploading(true);
                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  const response = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData,
                  });
                  
                  if (!response.ok) throw new Error('Error al subir imagen');
                  
                  const { url } = await response.json();
                  setFormData(prev => ({ ...prev, imagen: url }));
                  toast.success('Imagen subida exitosamente');
                } catch (error) {
                  toast.error('Error al subir imagen');
                } finally {
                  setUploading(false);
                }
              }}
              disabled={uploading}
            />
            {formData.imagen && (
              <div className="mt-2">
                <img src={formData.imagen} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
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
