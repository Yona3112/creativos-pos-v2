import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface NotaCreditoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ventaId?: number;
}

export default function NotaCreditoDialog({
  open,
  onOpenChange,
  ventaId,
}: NotaCreditoDialogProps) {
  const [formData, setFormData] = useState({
    ventaId: ventaId || 0,
    motivo: "",
    detalles: [] as Array<{ productoId: number; cantidad: number; precioUnitario: number }>,
  });

  const crear = trpc.notasCredito.crear.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      setFormData({ ventaId: 0, motivo: "", detalles: [] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por ahora, crear nota de crédito sin detalles específicos
    crear.mutate({
      ventaId: formData.ventaId,
      motivo: formData.motivo,
      detalles: formData.detalles,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Nota de Crédito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>ID de Venta</Label>
            <Input
              type="number"
              value={formData.ventaId}
              onChange={(e) =>
                setFormData({ ...formData, ventaId: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <Label>Motivo</Label>
            <Textarea
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              required
            />
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
