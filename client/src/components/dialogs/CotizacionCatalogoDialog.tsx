import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

interface CotizacionDialogProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
}

export default function CotizacionCatalogoDialog({
  open,
  onClose,
  cart,
  total,
  onSuccess,
}: CotizacionDialogProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviarCotizacion = trpc.catalogo.solicitarCotizacion.useMutation({
    onSuccess: () => {
      toast.success("Cotización enviada exitosamente", {
        description: "Nos pondremos en contacto contigo pronto",
      });
      setNombre("");
      setEmail("");
      setTelefono("");
      setMensaje("");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Error al enviar cotización", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !telefono) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    enviarCotizacion.mutate({
      nombre,
      email,
      telefono,
      mensaje,
      productos: cart.map(item => ({
        productoId: item.productoId,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      total,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Cotización</DialogTitle>
          <DialogDescription>
            Completa tus datos y te enviaremos una cotización detallada por email
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resumen del carrito */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Resumen de Productos</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productoId} className="flex justify-between text-sm">
                  <span>
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span className="font-medium">L {(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-blue-600">L {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="telefono">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+504 1234-5678"
              required
            />
          </div>

          <div>
            <Label htmlFor="mensaje">Mensaje Adicional (Opcional)</Label>
            <Textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="¿Alguna pregunta o comentario adicional?"
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={enviarCotizacion.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={enviarCotizacion.isPending}
            >
              {enviarCotizacion.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Cotización
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
