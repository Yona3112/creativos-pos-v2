import { and, desc, eq, sql } from "drizzle-orm";
import { cotizaciones, detallesCotizacion, productos } from "../../drizzle/schema";
import { getDb } from "../db";

export type Cotizacion = typeof cotizaciones.$inferSelect;
export type InsertCotizacion = typeof cotizaciones.$inferInsert;
export type DetalleCotizacion = typeof detallesCotizacion.$inferSelect;
export type InsertDetalleCotizacion = typeof detallesCotizacion.$inferInsert;

/**
 * Obtener todas las cotizaciones
 */
export async function getAllCotizaciones(params?: {
  limit?: number;
  offset?: number;
  estado?: string;
  usuarioId?: number;
  sucursalId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { limit = 100, offset = 0, estado, usuarioId, sucursalId } = params || {};

  const conditions = [];
  
  if (estado) {
    conditions.push(eq(cotizaciones.estado, estado as any));
  }
  
  if (usuarioId) {
    conditions.push(eq(cotizaciones.usuarioId, usuarioId));
  }
  
  if (sucursalId) {
    conditions.push(eq(cotizaciones.sucursalId, sucursalId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  await db
    .select()
    .from(cotizaciones)
    .where(whereClause)
    .orderBy(desc(cotizaciones.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

/**
 * Obtener una cotización por ID con sus detalles
 */
export async function getCotizacionById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const cotizacion = await db.select().from(cotizaciones).where(eq(cotizaciones.id, id)).limit(1);
  
  if (cotizacion.length === 0) {
    return undefined;
  }

  const detalles = await db
    .select({
      id: detallesCotizacion.id,
      productoId: detallesCotizacion.productoId,
      cantidad: detallesCotizacion.cantidad,
      precioUnitario: detallesCotizacion.precioUnitario,
      descuento: detallesCotizacion.descuento,
      subtotal: detallesCotizacion.subtotal,
      productoNombre: productos.nombre,
      productoCodigo: productos.codigo,
    })
    .from(detallesCotizacion)
    .leftJoin(productos, eq(detallesCotizacion.productoId, productos.id))
    .where(eq(detallesCotizacion.cotizacionId, id));

  return {
    ...cotizacion[0],
    detalles,
  };
}

/**
 * Crear una nueva cotización con sus detalles
 */
export async function createCotizacion(data: {
  cotizacion: InsertCotizacion;
  detalles: InsertDetalleCotizacion[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Insertar cotización
  await db.insert(cotizaciones).values(data.cotizacion);
  const cotizacionResult = await db.select().from(cotizaciones).orderBy(desc(cotizaciones.id)).limit(1);
  const nuevaCotizacion = cotizacionResult[0];

  // Insertar detalles
  const detallesConCotizacionId = data.detalles.map(detalle => ({
    ...detalle,
    cotizacionId: nuevaCotizacion.id,
  }));

  await db.insert(detallesCotizacion).values(detallesConCotizacionId);

  return getCotizacionById(nuevaCotizacion.id);
}

/**
 * Actualizar estado de cotización
 */
export async function updateEstadoCotizacion(id: number, estado: string): Promise<Cotizacion> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(cotizaciones)
    .set({ estado: estado as any, updatedAt: new Date() })
    .where(eq(cotizaciones.id, id));

  const [result] = await db.select().from(cotizaciones).where(eq(cotizaciones.id, id)).limit(1);
  
  if (!result) {
    throw new Error(`Cotización con ID ${id} no encontrada`);
  }

  return result;
}

/**
 * Generar número de cotización
 */
export async function generarNumeroCotizacion(sucursalId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  
  const ultimaCotizacion = await db
    .select()
    .from(cotizaciones)
    .where(eq(cotizaciones.sucursalId, sucursalId))
    .orderBy(desc(cotizaciones.id))
    .limit(1);

  let consecutivo = 1;
  if (ultimaCotizacion.length > 0) {
    const ultimoNumero = ultimaCotizacion[0].numero;
    const partes = ultimoNumero.split('-');
    if (partes.length === 4) {
      consecutivo = parseInt(partes[3]) + 1;
    }
  }

  return `COT-${sucursalId}-${año}${mes}-${String(consecutivo).padStart(6, '0')}`;
}
