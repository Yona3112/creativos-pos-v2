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
      rtn: formData.rtn || undefined,
      telefono: formData.telefono || undefined,
      email: formData.email || undefined,
      direccion: formData.direccion || undefined,
      nivel: formData.nivel,
      descuento: parseFloat(formData.descuento) || undefined,
      credito: parseFloat(formData.credito) || undefined,
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
