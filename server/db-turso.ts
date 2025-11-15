import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../drizzle/schema";

let _dbTurso: ReturnType<typeof drizzle> | null = null;

/**
 * Obtener instancia de base de datos Turso
 * Usa variables de entorno TURSO_DATABASE_URL y TURSO_AUTH_TOKEN
 */
export async function getDbTurso() {
  if (!_dbTurso && process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    try {
      const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });

      _dbTurso = drizzle(client, { schema });
      console.log("[Database] Connected to Turso successfully");
    } catch (error) {
      console.error("[Database] Failed to connect to Turso:", error);
      _dbTurso = null;
    }
  }
  return _dbTurso;
}

/**
 * Verificar si Turso está configurado
 */
export function isTursoConfigured(): boolean {
  return !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}
