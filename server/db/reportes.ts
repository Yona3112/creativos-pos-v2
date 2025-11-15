import { and, between, desc, eq, sql, sum } from "drizzle-orm";
import { ventas, detallesVenta, productos, clientes } from "../../drizzle/schema";
import { getDb } from "../db";

/**
 * Reporte de ventas por período
 */
export async function getReporteVentas(params: {
  fechaInicio: Date;
  fechaFin: Date;
  sucursalId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { fechaInicio, fechaFin, sucursalId } = params;

  const conditions = [
    eq(ventas.anulada, false),
    between(ventas.createdAt, fechaInicio, fechaFin),
  ];

  if (sucursalId) {
    conditions.push(eq(ventas.sucursalId, sucursalId));
  }

  const result = await db
    .select({
      totalVentas: sql<number>`count(*)`,
      montoTotal: sum(ventas.total),
      montoSubtotal: sum(ventas.subtotal),
      montoDescuento: sum(ventas.descuento),
      montoImpuesto: sum(ventas.impuesto),
    })
    .from(ventas)
    .where(and(...conditions));

  return result[0];
}

/**
 * Productos más vendidos
 */
export async function getProductosMasVendidos(params: {
  fechaInicio: Date;
  fechaFin: Date;
  limit?: number;
  sucursalId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { fechaInicio, fechaFin, limit = 10, sucursalId } = params;

  const conditions = [
    eq(ventas.anulada, false),
    between(ventas.createdAt, fechaInicio, fechaFin),
  ];

  if (sucursalId) {
    conditions.push(eq(ventas.sucursalId, sucursalId));
  }

  const result = await db
    .select({
      productoId: detallesVenta.productoId,
      productoNombre: productos.nombre,
      productoCodigo: productos.codigo,
      cantidadVendida: sum(detallesVenta.cantidad),
      montoTotal: sum(detallesVenta.subtotal),
    })
    .from(detallesVenta)
    .innerJoin(ventas, eq(detallesVenta.ventaId, ventas.id))
    .innerJoin(productos, eq(detallesVenta.productoId, productos.id))
    .where(and(...conditions))
    .groupBy(detallesVenta.productoId, productos.nombre, productos.codigo)
    .orderBy(desc(sum(detallesVenta.cantidad)))
    .limit(limit);

  return result;
}

/**
 * Ventas por método de pago
 */
export async function getVentasPorMetodoPago(params: {
  fechaInicio: Date;
  fechaFin: Date;
  sucursalId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { fechaInicio, fechaFin, sucursalId } = params;

  const conditions = [
    eq(ventas.anulada, false),
    between(ventas.createdAt, fechaInicio, fechaFin),
  ];

  if (sucursalId) {
    conditions.push(eq(ventas.sucursalId, sucursalId));
  }

  const result = await db
    .select({
      metodoPago: ventas.metodoPago,
      cantidad: sql<number>`count(*)`,
      monto: sum(ventas.total),
    })
    .from(ventas)
    .where(and(...conditions))
    .groupBy(ventas.metodoPago);

  return result;
}

/**
 * Clientes con más compras
 */
export async function getClientesTopCompradores(params: {
  fechaInicio: Date;
  fechaFin: Date;
  limit?: number;
  sucursalId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { fechaInicio, fechaFin, limit = 10, sucursalId } = params;

  const conditions = [
    eq(ventas.anulada, false),
    between(ventas.createdAt, fechaInicio, fechaFin),
    sql`${ventas.clienteId} IS NOT NULL`,
  ];

  if (sucursalId) {
    conditions.push(eq(ventas.sucursalId, sucursalId));
  }

  const result = await db
    .select({
      clienteId: ventas.clienteId,
      clienteNombre: clientes.nombre,
      cantidadCompras: sql<number>`count(*)`,
      montoTotal: sum(ventas.total),
    })
    .from(ventas)
    .innerJoin(clientes, eq(ventas.clienteId, clientes.id))
    .where(and(...conditions))
    .groupBy(ventas.clienteId, clientes.nombre)
    .orderBy(desc(sum(ventas.total)))
    .limit(limit);

  return result;
}

/**
 * Inventario valorizado
 */
export async function getInventarioValorizado() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select({
      totalProductos: sql<number>`count(*)`,
      stockTotal: sum(productos.stock),
      valorCosto: sql<number>`sum(${productos.stock} * ${productos.costo})`,
      valorVenta: sql<number>`sum(${productos.stock} * ${productos.precio})`,
    })
    .from(productos)
    .where(eq(productos.activo, true));

  return result[0];
}

/**
 * Productos con stock bajo
 */
export async function getProductosStockBajo() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(productos)
    .where(
      and(
        eq(productos.activo, true),
        sql`${productos.stock} <= ${productos.stockMinimo}`
      )
    )
    .orderBy(productos.stock);

  return result;
}

/**
 * Estadísticas para el dashboard
 */
export async function getEstadisticasDashboard(params: {
  fechaInicio: Date;
  fechaFin: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { fechaInicio, fechaFin } = params;

  // Ventas totales (no anuladas)
  const ventasResult = await db
    .select({
      totalVentas: sql<number>`count(*)`,
      montoTotal: sum(ventas.total),
      montoSubtotal: sum(ventas.subtotal),
      montoImpuesto: sum(ventas.impuesto),
    })
    .from(ventas)
    .where(
      and(
        eq(ventas.anulada, false),
        between(ventas.createdAt, fechaInicio, fechaFin)
      )
    );

  // Calcular costos totales de las ventas
  const costosResult = await db
    .select({
      costoTotal: sql<number>`sum(${detallesVenta.cantidad} * ${productos.costo})`,
    })
    .from(detallesVenta)
    .innerJoin(ventas, eq(detallesVenta.ventaId, ventas.id))
    .innerJoin(productos, eq(detallesVenta.productoId, productos.id))
    .where(
      and(
        eq(ventas.anulada, false),
        between(ventas.createdAt, fechaInicio, fechaFin)
      )
    );

  // Notas de crédito
  const { notasCredito } = await import("../../drizzle/schema");
  const notasCreditoResult = await db
    .select({
      totalNotasCredito: sql<number>`count(*)`,
      montoNotasCredito: sum(notasCredito.monto),
    })
    .from(notasCredito)
    .where(between(notasCredito.createdAt, fechaInicio, fechaFin));

  // Ventas canceladas
  const ventasCanceladasResult = await db
    .select({
      totalCanceladas: sql<number>`count(*)`,
    })
    .from(ventas)
    .where(
      and(
        eq(ventas.anulada, true),
        between(ventas.createdAt, fechaInicio, fechaFin)
      )
    );

  const ventasData = ventasResult[0] || {};
  const costosData = costosResult[0] || {};
  const notasCreditoData = notasCreditoResult[0] || {};
  const canceladasData = ventasCanceladasResult[0] || {};

  const montoTotal = Number((ventasData as any).montoTotal || 0);
  const costoTotal = Number((costosData as any).costoTotal || 0);
  const ganancia = montoTotal - costoTotal;

  return {
    totalVentas: Number((ventasData as any).totalVentas || 0),
    montoTotal,
    montoSubtotal: Number((ventasData as any).montoSubtotal || 0),
    montoImpuesto: Number((ventasData as any).montoImpuesto || 0),
    costoTotal,
    ganancia,
    totalNotasCredito: Number((notasCreditoData as any).totalNotasCredito || 0),
    montoNotasCredito: Number((notasCreditoData as any).montoNotasCredito || 0),
    totalCanceladas: Number((canceladasData as any).totalCanceladas || 0),
  };
}

/**
 * Obtener ventas agrupadas por día para gráficos
 */
export async function getVentasPorPeriodo(params: {
  fechaInicio: Date;
  fechaFin: Date;
}) {
  const db = await getDb();
  if (!db) return [];

  try {
    const ventasData = await db
      .select({
        fecha: ventas.createdAt,
        total: ventas.total,
      })
      .from(ventas)
      .where(
        and(
          eq(ventas.anulada, false),
          between(ventas.createdAt, params.fechaInicio, params.fechaFin)
        )
      );

    // Agrupar por día
    const ventasPorDia = ventasData.reduce((acc: any[], venta) => {
      const fecha = new Date(venta.fecha);
      fecha.setHours(0, 0, 0, 0);
      const fechaStr = fecha.toISOString();

      const existing = acc.find((item: any) => item.fecha === fechaStr);
      if (existing) {
        existing.total += venta.total;
        existing.cantidad += 1;
      } else {
        acc.push({
          fecha: fechaStr,
          total: venta.total,
          cantidad: 1,
        });
      }
      return acc;
    }, []);

    return ventasPorDia.sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  } catch (error) {
    console.error("[Reportes] Error al obtener ventas por período:", error);
    return [];
  }
}
