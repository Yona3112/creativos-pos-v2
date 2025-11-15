import { useState, useMemo } from "react";
import POSLayout from "@/components/POSLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  FileText,
  XCircle,
  Receipt,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  // Período de 30 días por defecto
  const [periodo] = useState(() => {
    const fin = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - 30);
    return { inicio, fin };
  });

  const { data: estadisticas, isLoading } = trpc.reportes.estadisticasDashboard.useQuery({
    fechaInicio: periodo.inicio,
    fechaFin: periodo.fin,
  });

  const stats = useMemo(() => {
    if (!estadisticas) {
      return [
        {
          title: "Ventas Totales",
          value: "L 0.00",
          icon: DollarSign,
          description: "0 transacciones",
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Ganancias",
          value: "L 0.00",
          icon: TrendingUp,
          description: "Últimos 30 días",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Costos",
          value: "L 0.00",
          icon: Package,
          description: "Costo de ventas",
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
        {
          title: "ISV (Impuesto)",
          value: "L 0.00",
          icon: Receipt,
          description: "Impuesto sobre ventas",
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Notas de Crédito",
          value: "0",
          icon: FileText,
          description: "L 0.00",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          title: "Cancelaciones",
          value: "0",
          icon: XCircle,
          description: "Ventas anuladas",
          color: "text-red-600",
          bgColor: "bg-red-100",
        },
      ];
    }

    return [
      {
        title: "Ventas Totales",
        value: `L ${estadisticas.montoTotal.toFixed(2)}`,
        icon: DollarSign,
        description: `${estadisticas.totalVentas} transacciones`,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "Ganancias",
        value: `L ${estadisticas.ganancia.toFixed(2)}`,
        icon: TrendingUp,
        description: "Últimos 30 días",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Costos",
        value: `L ${estadisticas.costoTotal.toFixed(2)}`,
        icon: Package,
        description: "Costo de ventas",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
      {
        title: "ISV (Impuesto)",
        value: `L ${estadisticas.montoImpuesto.toFixed(2)}`,
        icon: Receipt,
        description: "Impuesto sobre ventas",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        title: "Notas de Crédito",
        value: estadisticas.totalNotasCredito.toString(),
        icon: FileText,
        description: `L ${estadisticas.montoNotasCredito.toFixed(2)}`,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      {
        title: "Cancelaciones",
        value: estadisticas.totalCanceladas.toString(),
        icon: XCircle,
        description: "Ventas anuladas",
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
    ];
  }, [estadisticas]);

  return (
    <POSLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Resumen de los últimos 30 días</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando estadísticas...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumen Financiero */}
            {estadisticas && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Resumen Financiero
                  </CardTitle>
                  <CardDescription>Análisis de rentabilidad del período</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Subtotal de Ventas:</span>
                      <span className="font-semibold">L {estadisticas.montoSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">ISV (15%):</span>
                      <span className="font-semibold">L {estadisticas.montoImpuesto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Total Ventas:</span>
                      <span className="font-semibold text-green-600 text-lg">
                        L {estadisticas.montoTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Costos:</span>
                      <span className="font-semibold text-orange-600">
                        -L {estadisticas.costoTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Notas de Crédito:</span>
                      <span className="font-semibold text-yellow-600">
                        -L {estadisticas.montoNotasCredito.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
                      <span className="font-semibold text-gray-900">Ganancia Neta:</span>
                      <span className={`font-bold text-xl ${
                        estadisticas.ganancia >= 0 ? "text-blue-600" : "text-red-600"
                      }`}>
                        {estadisticas.ganancia >= 0 ? (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-5 w-5" />
                            L {estadisticas.ganancia.toFixed(2)}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <TrendingDown className="h-5 w-5" />
                            L {Math.abs(estadisticas.ganancia).toFixed(2)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </POSLayout>
  );
}
