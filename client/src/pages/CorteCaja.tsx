import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { DollarSign } from "lucide-react";

export default function CorteCaja() {
  const { user } = useAuth();
  const { data: cajaActual } = trpc.cortesCaja.actual.useQuery({ usuarioId: user?.id || 0 });
  const abrirCaja = trpc.cortesCaja.abrir.useMutation();
  const cerrarCaja = trpc.cortesCaja.cerrar.useMutation();

  return (
    <POSLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Corte de Caja</h1>

        {cajaActual?.estado === 'abierto' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Monto Inicial</h3>
              <p className="text-2xl font-bold">L {cajaActual.montoInicial.toFixed(2)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Ventas</h3>
              <p className="text-2xl font-bold text-green-600">L {cajaActual.totalVentas.toFixed(2)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Monto Esperado</h3>
              <p className="text-2xl font-bold">L {cajaActual.montoEsperado.toFixed(2)}</p>
            </Card>
            
            <Card className="p-6 col-span-full">
              <h3 className="font-semibold mb-4">Cerrar Caja</h3>
              <Button onClick={() => {
                const montoReal = prompt("Ingrese el monto real en caja:");
                if (montoReal) {
                  cerrarCaja.mutate({ id: cajaActual.id, montoReal: parseFloat(montoReal) });
                }
              }}>
                Cerrar Caja
              </Button>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Abrir Caja</h3>
            <Button onClick={() => {
              const montoInicial = prompt("Ingrese el monto inicial:");
              if (montoInicial && user) {
                abrirCaja.mutate({ usuarioId: user.id, montoInicial: parseFloat(montoInicial) });
              }
            }}>
              <DollarSign className="w-4 h-4 mr-2" />
              Abrir Caja
            </Button>
          </Card>
        )}
      </div>
    </POSLayout>
  );
}
