import { and, between, desc, eq, sql, sum } from "drizzle-orm";
import { ventas, detallesVenta, productos } from "../../drizzle/schema";
import { getDb } from "../db";

export type Venta = typeof ventas.$inferSelect;
export type InsertVenta = typeof ventas.$inferInsert;
export type DetalleVenta = typeof detallesVenta.$inferSelect;
export type InsertDetalleVenta = typeof detallesVenta.$inferInsert;

/**
 * Obtener todas las ventas con paginación
 */
export async function getAllVentas(params?: {
  limit?: number;
  offset?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  usuarioId?: number;
  sucursalId?: number;
  anulada?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { limit = 100, offset = 0, fechaInicio, fechaFin, usuarioId, sucursalId, anulada = false } = params || {};

  const conditions = [];
  
  conditions.push(eq(ventas.anulada, anulada));
  
  if (usuarioId) {
    conditions.push(eq(ventas.usuarioId, usuarioId));
  }
  
  if (sucursalId) {
    conditions.push(eq(ventas.sucursalId, sucursalId));
  }
  
  if (fechaInicio && fechaFin) {
    conditions.push(between(ventas.createdAt, fechaInicio, fechaFin));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(ventas)
    .where(whereClause)
    .orderBy(desc(ventas.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

/**
 * Obtener una venta por ID con sus detalles
 */
export async function getVentaById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const venta = await db.select().from(ventas).where(eq(ventas.id, id)).limit(1);
  
  if (venta.length === 0) {
    return undefined;
  }

  const detalles = await db
    .select({
      id: detallesVenta.id,
      productoId: detallesVenta.productoId,
      cantidad: detallesVenta.cantidad,
      precioUnitario: detallesVenta.precioUnitario,
      descuento: detallesVenta.descuento,
      subtotal: detallesVenta.subtotal,
      productoNombre: productos.nombre,
      productoCodigo: productos.codigo,
    })
    .from(detallesVenta)
    .leftJoin(productos, eq(detallesVenta.productoId, productos.id))
    .where(eq(detallesVenta.ventaId, id));

  return {
    ...venta[0],
    detalles,
  };
}

/**
 * Crear una nueva venta con sus detalles
 */
export async function createVenta(data: {
  venta: InsertVenta;
  detalles: InsertDetalleVenta[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Insertar venta
  await db.insert(ventas).values(data.venta);
  const ventaResult = await db.select().from(ventas).orderBy(desc(ventas.id)).limit(1);
  const nuevaVenta = ventaResult[0];

  // Insertar detalles
  const detallesConVentaId = data.detalles.map(detalle => ({
    ...detalle,
    ventaId: nuevaVenta.id,
  }));

  await db.insert(detallesVenta).values(detallesConVentaId);

  // Actualizar stock de productos
  for (const detalle of data.detalles) {
    await db
      .update(productos)
      .set({
        stock: sql`${productos.stock} - ${detalle.cantidad}`,
        updatedAt: new Date(),
      })
      .where(eq(productos.id, detalle.productoId));
  }

  return getVentaById(nuevaVenta.id);
}

/**
 * Anular una venta
 */
export async function anularVenta(id: number): Promise<Venta> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Obtener detalles de la venta
  const detalles = await db
    .select()
    .from(detallesVenta)
    .where(eq(detallesVenta.ventaId, id));

  // Restaurar stock
  for (const detalle of detalles) {
    await db
      .update(productos)
      .set({
        stock: sql`${productos.stock} + ${detalle.cantidad}`,
        updatedAt: new Date(),
      })
      .where(eq(productos.id, detalle.productoId));
  }

  // Marcar venta como anulada
  await db
    .update(ventas)
    .set({ anulada: true })
    .where(eq(ventas.id, id));

  const [result] = await db.select().from(ventas).where(eq(ventas.id, id)).limit(1);
  
  if (!result) {
    throw new Error(`Venta con ID ${id} no encontrada`);
  }

  return result;
}

/**
 * Obtener total de ventas por período
 */
export async function getTotalVentas(params: {
  fechaInicio: Date;
  fechaFin: Date;
  sucursalId?: number;
}): Promise<number> {
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
    .select({ total: sum(ventas.total) })
    .from(ventas)
    .where(and(...conditions));

  return Number(result[0]?.total) || 0;
}

/**
 * Obtener ventas del día
 */
export async function getVentasDelDia(sucursalId?: number) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  return getAllVentas({
    fechaInicio: hoy,
    fechaFin: manana,
    sucursalId,
    anulada: false,
  });
}

/**
 * Generar número de factura
 */
export async function generarNumeroFactura(sucursalId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  
  const ultimaVenta = await db
    .select()
    .from(ventas)
    .where(eq(ventas.sucursalId, sucursalId))
    .orderBy(desc(ventas.id))
    .limit(1);

  let consecutivo = 1;
  if (ultimaVenta.length > 0) {
    const ultimoNumero = ultimaVenta[0].numeroFactura;
    const partes = ultimoNumero.split('-');
    if (partes.length === 4) {
      consecutivo = parseInt(partes[3]) + 1;
    }
  }

  return `${sucursalId}-${año}${mes}-${String(consecutivo).padStart(6, '0')}`;
}
