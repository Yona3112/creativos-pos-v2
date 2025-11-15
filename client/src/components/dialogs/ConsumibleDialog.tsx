import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface ConsumibleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConsumibleDialog({
  open,
  onOpenChange,
}: ConsumibleDialogProps) {
  const [formData, setFormData] = useState({
    productoId: 0,
    unidadMedida: "",
    cantidadPorUnidad: 1,
    stockActual: 0,
    stockMinimo: 0,
  });

  const crear = trpc.consumibles.crear.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      setFormData({
        productoId: 0,
        unidadMedida: "",
        cantidadPorUnidad: 1,
        stockActual: 0,
        stockMinimo: 0,
      });
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
          <DialogTitle>Nuevo Consumible</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>ID de Producto</Label>
            <Input
              type="number"
              value={formData.productoId}
              onChange={(e) =>
                setFormData({ ...formData, productoId: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <Label>Unidad de Medida</Label>
            <Input
              value={formData.unidadMedida}
              onChange={(e) =>
                setFormData({ ...formData, unidadMedida: e.target.value })
              }
              placeholder="ej: litros, metros, kg"
              required
            />
          </div>
          <div>
            <Label>Cantidad por Unidad</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.cantidadPorUnidad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cantidadPorUnidad: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stock Actual</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.stockActual}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockActual: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Stock Mínimo</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.stockMinimo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockMinimo: parseFloat(e.target.value),
                  })
                }
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
