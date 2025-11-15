import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { clientes } from "../../drizzle/schema";
import { getDb } from "../db";

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

/**
 * Obtener todos los clientes con paginación y búsqueda
 */
export async function getAllClientes(params?: {
  limit?: number;
  offset?: number;
  search?: string;
  activo?: boolean;
  nivel?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { limit = 100, offset = 0, search, activo = true, nivel } = params || {};

  const conditions = [];
  
  if (activo !== undefined) {
    conditions.push(eq(clientes.activo, activo));
  }
  
  if (nivel) {
    conditions.push(eq(clientes.nivel, nivel as any));
  }
  
  if (search) {
    conditions.push(
      or(
        like(clientes.nombre, `%${search}%`),
        like(clientes.rtn, `%${search}%`),
        like(clientes.telefono, `%${search}%`),
        like(clientes.email, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  await db
    .select()
    .from(clientes)
    .where(whereClause)
    .orderBy(desc(clientes.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

/**
 * Obtener un cliente por ID
 */
export async function getClienteById(id: number): Promise<Cliente | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return result;
}

/**
 * Obtener un cliente por RTN
 */
export async function getClienteByRtn(rtn: string): Promise<Cliente | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.select().from(clientes).where(eq(clientes.rtn, rtn)).limit(1);
  return result;
}

/**
 * Crear un nuevo cliente
 */
export async function createCliente(data: Omit<InsertCliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(clientes).values(data);
  await db.select().from(clientes).orderBy(desc(clientes.id)).limit(1);
  return result;
}

/**
 * Actualizar un cliente
 */
export async function updateCliente(id: number, data: Partial<InsertCliente>): Promise<Cliente> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(clientes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clientes.id, id));

  const [result] = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  
  if (!result) {
    throw new Error(`Cliente con ID ${id} no encontrado`);
  }

  return result;
}

/**
 * Eliminar un cliente (soft delete)
 */
export async function deleteCliente(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(clientes)
    .set({ activo: false, updatedAt: new Date() })
    .where(eq(clientes.id, id));
    const result = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
}

/**
 * Actualizar crédito de un cliente
 */
export async function updateCredito(id: number, monto: number): Promise<Cliente> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(clientes)
    .set({
      credito: sql`${clientes.credito} + ${monto}`,
      updatedAt: new Date(),
    })
    .where(eq(clientes.id, id));

  const [result] = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  
  if (!result) {
    throw new Error(`Cliente con ID ${id} no encontrado`);
  }

  return result;
}

/**
 * Contar clientes
 */
export async function countClientes(params?: { activo?: boolean }): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { activo = true } = params || {};

  const conditions = [];
  
  if (activo !== undefined) {
    conditions.push(eq(clientes.activo, activo));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  await db
    .select({ count: sql<number>`count(*)` })
    .from(clientes)
    .where(whereClause);

  return Number((result[0] as any)?.count || 0);
}
