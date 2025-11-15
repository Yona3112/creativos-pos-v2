import { useEffect } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function Factura() {
  const [, params] = useRoute("/factura/:id");
  const ventaId = params?.id ? parseInt(params.id) : 0;

  const { data: venta, isLoading } = trpc.ventas.getById.useQuery({ id: ventaId });

  useEffect(() => {
    if (venta && !isLoading) {
      setTimeout(() => window.print(), 500);
    }
  }, [venta, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando factura...</p>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Factura no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 print:hidden">
          <Button onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Factura
          </Button>
        </div>

        <div className="border-2 border-gray-300 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Creativos Gift Shop</h1>
            <p className="text-gray-600">Sistema de Punto de Venta</p>
            <p className="text-sm text-gray-500 mt-2">RTN: 0000-0000-000000</p>
          </div>

          <div className="mb-8 pb-8 border-b-2 border-gray-300">
            <h2 className="font-bold text-lg mb-2">Factura</h2>
            <p className="text-gray-700">Número: {venta.numeroFactura}</p>
            <p className="text-gray-700">Fecha: {new Date(venta.createdAt).toLocaleString()}</p>
            <p className="text-gray-700">Método de Pago: {venta.metodoPago}</p>
            {venta.clienteId && <p className="text-gray-700">Cliente ID: {venta.clienteId}</p>}
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2">Producto</th>
                <th className="text-center py-2">Cantidad</th>
                <th className="text-right py-2">Precio</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles?.map((detalle, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">{detalle.productoNombre || `Producto #${detalle.productoId}`}</td>
                  <td className="text-center py-2">{detalle.cantidad}</td>
                  <td className="text-right py-2">L {detalle.precioUnitario.toFixed(2)}</td>
                  <td className="text-right py-2">L {detalle.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span>L {venta.subtotal.toFixed(2)}</span>
              </div>
              {(venta.descuento || 0) > 0 && (
                <div className="flex justify-between py-2">
                  <span className="font-medium">Descuento:</span>
                  <span>- L {(venta.descuento || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="font-medium">ISV (15%):</span>
                <span>L {(venta.impuesto || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-gray-300 text-xl font-bold">
                <span>TOTAL:</span>
                <span>L {venta.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
            <p>¡Gracias por su compra!</p>
            <p className="mt-2">Esta es una factura válida</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
