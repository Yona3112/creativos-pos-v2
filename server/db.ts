import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Obtener instancia de base de datos PostgreSQL
 */
export async function getDb() {
  if (!_db) {
    try {
      const connectionString = process.env.POSTGRES_URL;
      
      if (!connectionString) {
        console.warn("[Database] No PostgreSQL connection string found");
        return null;
      }
      
      console.log("[Database] Initializing PostgreSQL");
      
      const client = postgres(connectionString);
      _db = drizzle(client, { schema });
      
      console.log("[Database] PostgreSQL initialized successfully");
    } catch (error: any) {
      console.error("[Database] Failed to connect to PostgreSQL:", error.message);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: any): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: any = {
      openId: user.openId,
    };
    const updateSet: any = {};

    // Mapear campos del usuario
    if (user.name !== undefined) values.name = user.name;
    if (user.nombre !== undefined) values.name = user.nombre;
    if (user.email !== undefined) values.email = user.email;
    if (user.loginMethod !== undefined) values.loginMethod = user.loginMethod;
    
    // Copiar a updateSet
    Object.keys(values).forEach(key => {
      if (key !== 'openId') updateSet[key] = values[key];
    });

    // Manejar rol
    if (user.rol !== undefined || user.role !== undefined) {
      values.role = user.rol || user.role;
      updateSet.role = user.rol || user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    // Timestamp
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
      updateSet.lastSignedIn = new Date();
    }

    // Upsert
    await db.insert(schema.usuarios)
      .values(values)
      .onConflictDoUpdate({
        target: schema.usuarios.openId,
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<any | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(schema.usuarios).where(eq(schema.usuarios.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Exportar tipos
export type Usuario = typeof schema.usuarios.$inferSelect;
export type InsertUsuario = typeof schema.usuarios.$inferInsert;
export type User = Usuario;
export type InsertUser = InsertUsuario;
