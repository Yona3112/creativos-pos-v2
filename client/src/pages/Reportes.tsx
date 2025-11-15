import { useState } from "react";
import POSLayout from "@/components/POSLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { BarChart3, DollarSign, Download, Package, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { generarPDFInventario, generarPDFVentas } from "@/lib/pdfGenerator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reportes() {
  const [periodo, setPeriodo] = useState<"7" | "30" | "90" | "365">("30");

  // Calcular fechas según el período
  const getFechas = () => {
    const fin = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - parseInt(periodo));
    return { inicio, fin };
  };

  const { inicio, fin } = getFechas();

  const { data: ventasPorPeriodo } = trpc.reportes.ventasPorPeriodo.useQuery({
    fechaInicio: inicio,
    fechaFin: fin,
  });

  const { data: productosMasVendidos } = trpc.reportes.productosMasVendidos.useQuery({
    fechaInicio: inicio,
    fechaFin: fin,
    limit: 10,
  });

  const { data: ventasPorMetodo } = trpc.reportes.ventasPorMetodoPago.useQuery({
    fechaInicio: inicio,
    fechaFin: fin,
  });

  const { data: inventario } = trpc.reportes.inventarioValorizado.useQuery();
  const { data: stockBajo } = trpc.reportes.productosStockBajo.useQuery();

  // Datos para gráfico de línea (ventas por día)
  const ventasPorDiaData = ventasPorPeriodo?.map((v) => ({
    fecha: new Date(v.fecha).toLocaleDateString("es-HN", { month: "short", day: "numeric" }),
    ventas: v.total,
    cantidad: v.cantidad,
  })) || [];

  // Datos para gráfico de barras (productos más vendidos)
  const productosMasVendidosData = productosMasVendidos?.map((p) => ({
    nombre: p.productoNombre.length > 15 ? p.productoNombre.substring(0, 15) + "..." : p.productoNombre,
    cantidad: Number(p.cantidadVendida || 0),
    ingresos: Number(p.montoTotal || 0),
  })) || [];

  // Datos para gráfico de pie (ventas por método de pago)
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const ventasPorMetodoData = ventasPorMetodo?.map((m, index) => ({
    name: m.metodoPago,
    value: Number(m.monto || 0),
    color: COLORS[index % COLORS.length],
  })) || [];

  // Datos para gráfico de área (tendencia mensual)
  const ventasPorMesData = ventasPorPeriodo
    ?.reduce((acc: any[], v) => {
      const mes = new Date(v.fecha).toLocaleDateString("es-HN", { month: "short" });
      const existing = acc.find((item) => item.mes === mes);
      if (existing) {
        existing.ventas += v.total;
      } else {
        acc.push({ mes, ventas: v.total });
      }
      return acc;
    }, []) || [];

  const totalVentas = ventasPorPeriodo?.reduce((sum: number, v: any) => sum + v.total, 0) || 0;
  const totalTransacciones = ventasPorPeriodo?.reduce((sum: number, v: any) => sum + v.cantidad, 0) || 0;
  const ticketPromedio = totalTransacciones > 0 ? totalVentas / totalTransacciones : 0;

  return (
    <POSLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h2>
            <p className="text-sm text-gray-500">Panel de control y métricas</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Select value={periodo} onValueChange={(value: any) => setPeriodo(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                const ventas: any[] = [];
                generarPDFVentas(ventas, inicio.toISOString().split("T")[0], fin.toISOString().split("T")[0]);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              PDF Ventas
            </Button>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas Totales</p>
                <p className="text-2xl font-bold text-gray-900">L {totalVentas.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{totalTransacciones} transacciones</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Promedio</p>
                <p className="text-2xl font-bold text-gray-900">L {ticketPromedio.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Por transacción</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Inventario</p>
                <p className="text-2xl font-bold text-gray-900">L {(inventario?.valorVenta || 0).toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{inventario?.totalProductos || 0} productos</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900">{stockBajo?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Productos</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de línea: Ventas por día */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ventas por Día</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasPorDiaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip formatter={(value: number) => `L ${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2} name="Ventas (L)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de pie: Ventas por método de pago */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ventas por Método de Pago</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ventasPorMetodoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: L ${entry.value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ventasPorMetodoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `L ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de barras: Productos más vendidos */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productosMasVendidosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toFixed(0)} />
                <Legend />
                <Bar dataKey="cantidad" fill="#10b981" name="Cantidad Vendida" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de área: Tendencia mensual */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tendencia de Ventas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ventasPorMesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value: number) => `L ${value.toFixed(2)}`} />
                <Area type="monotone" dataKey="ventas" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Ventas (L)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </POSLayout>
  );
}
