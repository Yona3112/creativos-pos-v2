#!/bin/bash

# VentaDialog.tsx
cat > client/src/components/dialogs/VentaDialog.tsx << 'EOF'
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface CartItem {
  productoId: number;
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

interface VentaDialogProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  impuesto: number;
  total: number;
  onSuccess: () => void;
}

export default function VentaDialog({ open, onClose, cart, subtotal, impuesto, total, onSuccess }: VentaDialogProps) {
  const { user } = useAuth();
  const [metodoPago, setMetodoPago] = useState<"Efectivo" | "Tarjeta" | "Transferencia" | "Mixto">("Efectivo");
  const [efectivo, setEfectivo] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [transferencia, setTransferencia] = useState("");

  const utils = trpc.useUtils();
  const generarNumero = trpc.ventas.generarNumeroFactura.useQuery({ sucursalId: 1 });
  const crearVenta = trpc.ventas.create.useMutation({
    onSuccess: () => {
      toast.success("Venta procesada exitosamente");
      utils.ventas.invalidate();
      utils.productos.invalidate();
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Error al procesar la venta");
    },
  });

  const calcularCambio = () => {
    if (metodoPago === "Efectivo") {
      const pago = parseFloat(efectivo) || 0;
      return Math.max(0, pago - total);
    }
    return 0;
  };

  const handleSubmit = () => {
    if (!generarNumero.data) {
      toast.error("Error al generar número de factura");
      return;
    }

    if (!user?.id) {
      toast.error("Usuario no autenticado");
      return;
    }

    let montoEfectivo = 0;
    let montoTarjeta = 0;
    let montoTransferencia = 0;

    if (metodoPago === "Efectivo") {
      montoEfectivo = parseFloat(efectivo) || 0;
      if (montoEfectivo < total) {
        toast.error("El monto en efectivo es insuficiente");
        return;
      }
    } else if (metodoPago === "Tarjeta") {
      montoTarjeta = total;
    } else if (metodoPago === "Transferencia") {
      montoTransferencia = total;
    } else if (metodoPago === "Mixto") {
      montoEfectivo = parseFloat(efectivo) || 0;
      montoTarjeta = parseFloat(tarjeta) || 0;
      montoTransferencia = parseFloat(transferencia) || 0;
      
      const totalPagado = montoEfectivo + montoTarjeta + montoTransferencia;
      if (Math.abs(totalPagado - total) > 0.01) {
        toast.error("El total pagado no coincide con el total de la venta");
        return;
      }
    }

    crearVenta.mutate({
      venta: {
        numeroFactura: generarNumero.data,
        usuarioId: user.id,
        sucursalId: 1,
        subtotal,
        descuento: 0,
        impuesto,
        total,
        metodoPago,
        efectivo: montoEfectivo > 0 ? montoEfectivo : undefined,
        tarjeta: montoTarjeta > 0 ? montoTarjeta : undefined,
        transferencia: montoTransferencia > 0 ? montoTransferencia : undefined,
        cambio: calcularCambio(),
      },
      detalles: cart.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        descuento: 0,
        subtotal: item.subtotal,
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Procesar Venta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>L {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>ISV (15%):</span>
              <span>L {impuesto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span className="text-blue-600">L {total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Label>Método de Pago</Label>
            <RadioGroup value={metodoPago} onValueChange={(v: any) => setMetodoPago(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Efectivo" id="efectivo" />
                <Label htmlFor="efectivo">Efectivo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Tarjeta" id="tarjeta" />
                <Label htmlFor="tarjeta">Tarjeta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Transferencia" id="transferencia" />
                <Label htmlFor="transferencia">Transferencia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Mixto" id="mixto" />
                <Label htmlFor="mixto">Mixto</Label>
              </div>
            </RadioGroup>
          </div>

          {(metodoPago === "Efectivo" || metodoPago === "Mixto") && (
            <div>
              <Label>Efectivo Recibido</Label>
              <Input
                type="number"
                step="0.01"
                value={efectivo}
                onChange={(e) => setEfectivo(e.target.value)}
                placeholder="0.00"
              />
              {metodoPago === "Efectivo" && efectivo && (
                <p className="text-sm text-gray-600 mt-1">
                  Cambio: L {calcularCambio().toFixed(2)}
                </p>
              )}
            </div>
          )}

          {metodoPago === "Mixto" && (
            <>
              <div>
                <Label>Tarjeta</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Transferencia</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={transferencia}
                  onChange={(e) => setTransferencia(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={crearVenta.isPending}>
              {crearVenta.isPending ? "Procesando..." : "Confirmar Venta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
EOF

echo "VentaDialog.tsx creado"
