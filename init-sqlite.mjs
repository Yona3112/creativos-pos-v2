import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./drizzle/schema-sqlite.ts";

const sqlite = new Database("./data/pos.db");
const db = drizzle(sqlite, { schema });

console.log("🔧 Creando tablas...");

// Crear tablas
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openId TEXT UNIQUE,
    nombre TEXT,
    email TEXT UNIQUE,
    password TEXT,
    loginMethod TEXT,
    rol TEXT DEFAULT 'vendedor' NOT NULL,
    sucursalId INTEGER,
    activo INTEGER DEFAULT 1 NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    lastSignedIn INTEGER
  );

  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    costo REAL,
    stock INTEGER DEFAULT 0 NOT NULL,
    stockMinimo INTEGER DEFAULT 0,
    categoria TEXT,
    proveedor TEXT,
    imagen TEXT,
    activo INTEGER DEFAULT 1 NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
`);

console.log("✅ Tablas creadas");

// Insertar usuario admin
const now = Date.now();
const bcrypt = await import("bcryptjs");
const hashedPassword = await bcrypt.hash("admin123", 10);

sqlite.prepare(`
  INSERT OR IGNORE INTO usuarios (email, password, nombre, rol, loginMethod, activo, createdAt, updatedAt, lastSignedIn)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run("braham.admin@creativos.com", hashedPassword, "Braham Mejía", "admin", "local", 1, now, now, now);

console.log("✅ Usuario admin creado: braham.admin@creativos.com / admin123");

sqlite.close();
