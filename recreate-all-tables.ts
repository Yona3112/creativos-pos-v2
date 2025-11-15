import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { sql } from "drizzle-orm";

const sqlite = new Database("./data/pos.db");
const db = drizzle(sqlite);

// Crear todas las tablas que faltan
const tables = [
  `CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    nivel TEXT DEFAULT 'nuevo' CHECK(nivel IN ('nuevo', 'regular', 'vip')),
    limiteCredito REAL DEFAULT 0,
    saldoCredito REAL DEFAULT 0,
    activo INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  )`,
  
  `CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroFactura TEXT NOT NULL UNIQUE,
    clienteId INTEGER,
    usuarioId INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    impuesto REAL DEFAULT 0,
    descuento REAL DEFAULT 0,
    total REAL NOT NULL,
    metodoPago TEXT NOT NULL CHECK(metodoPago IN ('efectivo', 'tarjeta', 'transferencia', 'mixto')),
    estado TEXT DEFAULT 'completada' CHECK(estado IN ('completada', 'anulada', 'pendiente')),
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (clienteId) REFERENCES clientes(id),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS detallesVenta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ventaId INTEGER NOT NULL,
    productoId INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precioUnitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (ventaId) REFERENCES ventas(id),
    FOREIGN KEY (productoId) REFERENCES productos(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS cotizaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroCotizacion TEXT NOT NULL UNIQUE,
    clienteId INTEGER,
    usuarioId INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    impuesto REAL DEFAULT 0,
    descuento REAL DEFAULT 0,
    total REAL NOT NULL,
    estado TEXT DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'aprobada', 'rechazada', 'convertida')),
    validaHasta TEXT,
    notas TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (clienteId) REFERENCES clientes(id),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS detallesCotizacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cotizacionId INTEGER NOT NULL,
    productoId INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precioUnitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (cotizacionId) REFERENCES cotizaciones(id),
    FOREIGN KEY (productoId) REFERENCES productos(id)
  )`
];

for (const table of tables) {
  db.run(sql.raw(table));
}

console.log("✅ Todas las tablas creadas exitosamente");
