import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../drizzle/schema";

let _dbSQLite: ReturnType<typeof drizzle> | null = null;

/**
 * Obtener instancia de base de datos SQLite local
 */
export async function getDbSQLite() {
  if (!_dbSQLite) {
    try {
      const dbPath = process.env.SQLITE_DB_PATH || "./data/pos.db";
      console.log("[Database] Initializing SQLite:", dbPath);
      
      const sqlite = new Database(dbPath);
      _dbSQLite = drizzle(sqlite, { schema });
      
      console.log("[Database] SQLite initialized successfully");
    } catch (error: any) {
      console.error("[Database] Failed to connect to SQLite:", error.message);
      _dbSQLite = null;
    }
  }
  return _dbSQLite;
}
