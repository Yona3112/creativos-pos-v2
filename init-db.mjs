import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { readFileSync } from "fs";

const dbPath = "./data/pos.db";
console.log("Initializing SQLite database at:", dbPath);

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

// Leer el esquema SQL generado por drizzle-kit
try {
  const schema = readFileSync("./drizzle/schema-sqlite.sql", "utf-8");
  const statements = schema.split(";").filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      sqlite.exec(statement + ";");
    }
  }
  
  console.log("Database initialized successfully!");
} catch (error) {
  console.error("Error initializing database:", error.message);
  console.log("Creating tables manually...");
  
  // Si no hay archivo SQL, crear las tablas manualmente
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      openId TEXT UNIQUE,
      nombre TEXT,
      email TEXT UNIQUE,
      password TEXT,
      loginMethod TEXT,
      rol TEXT DEFAULT 'vendedor' NOT NULL CHECK(rol IN ('admin', 'vendedor', 'gerente')),
      sucursalId INTEGER,
      activo INTEGER DEFAULT 1 NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      lastSignedIn INTEGER
    );
  `);
  
  console.log("Basic tables created!");
}

sqlite.close();
