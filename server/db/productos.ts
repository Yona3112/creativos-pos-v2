import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { InsertProducto, productos, Producto } from "../../drizzle/schema";
import { getDb } from "../db";

/**
 * Obtener todos los productos activos con paginación
 */
export async function getAllProductos(params?: {
  limit?: number;
  offset?: number;
  categoriaId?: number;
  search?: string;
  activo?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { limit = 100, offset = 0, categoriaId, search, activo = true } = params || {};

  const conditions = [];
  
  if (activo !== undefined) {
    conditions.push(eq(productos.activo, activo));
  }
  
  // categoriaId removed - using categoria text field instead
  
  if (search) {
    conditions.push(
      or(
        ilike(productos.nombre, `%${search}%`),
        ilike(productos.codigo, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  await db
    .select()
    .from(productos)
    .where(whereClause)
    .orderBy(desc(productos.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

/**
 * Obtener un producto por ID
 */
export async function getProductoById(id: number): Promise<Producto | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  return result;
}

/**
 * Obtener un producto por código
 */
export async function getProductoByCodigo(codigo: string): Promise<Producto | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.select().from(productos).where(eq(productos.codigo, codigo)).limit(1);
  return result;
}

/**
 * Crear un nuevo producto
 */
export async function createProducto(data: Omit<InsertProducto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Producto> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(productos).values(data);
  await db.select().from(productos).orderBy(desc(productos.id)).limit(1);
  return result;
}

/**
 * Actualizar un producto
 */
export async function updateProducto(id: number, data: Partial<InsertProducto>): Promise<Producto> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(productos)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(productos.id, id));

  const [result] = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  
  if (!result) {
    throw new Error(`Producto con ID ${id} no encontrado`);
  }

  return result;
}

/**
 * Eliminar un producto (soft delete)
 */
export async function deleteProducto(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(productos)
    .set({ activo: false, updatedAt: new Date() })
    .where(eq(productos.id, id));
    const result = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
}

/**
 * Actualizar el stock de un producto
 */
export async function updateStock(id: number, cantidad: number): Promise<Producto> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(productos)
    .set({
      stock: sql`${productos.stock} + ${cantidad}`,
      updatedAt: new Date(),
    })
    .where(eq(productos.id, id));

  const [result] = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  
  if (!result) {
    throw new Error(`Producto con ID ${id} no encontrado`);
  }

  return result;
}

/**
 * Obtener productos con stock bajo
 */
export async function getProductosBajoStock(): Promise<Producto[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
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
 * Contar productos
 */
export async function countProductos(params?: { activo?: boolean }): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { activo = true } = params || {};

  const conditions = [];
  
  if (activo !== undefined) {
    conditions.push(eq(productos.activo, activo));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productos)
    .where(whereClause);

  return result[0]?.count || 0;
}
