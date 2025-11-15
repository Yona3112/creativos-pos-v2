import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface PromocionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PromocionDialog({
  open,
  onOpenChange,
}: PromocionDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "porcentaje" as "porcentaje" | "monto_fijo" | "2x1" | "3x2",
    valor: 0,
    aplicaA: "todos" as "categoria" | "producto" | "cliente" | "todos",
    fechaInicio: new Date(),
    fechaFin: new Date(),
  });

  const crear = trpc.promociones.crear.useMutation({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Promoción</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentaje">Porcentaje</SelectItem>
                  <SelectItem value="monto_fijo">Monto Fijo</SelectItem>
                  <SelectItem value="2x1">2x1</SelectItem>
                  <SelectItem value="3x2">3x2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: parseFloat(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label>Aplica A</Label>
            <Select
              value={formData.aplicaA}
              onValueChange={(value: any) =>
                setFormData({ ...formData, aplicaA: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="categoria">Categoría</SelectItem>
                <SelectItem value="producto">Producto Específico</SelectItem>
                <SelectItem value="cliente">Cliente Específico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                value={formData.fechaInicio.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fechaInicio: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Fecha Fin</Label>
              <Input
                type="date"
                value={formData.fechaFin.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fechaFin: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crear.isPending}>
              {crear.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
