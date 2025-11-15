import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./drizzle/schema-sqlite.ts";

const sqlite = new Database("./data/pos.db");
const db = drizzle(sqlite, { schema });

console.log("📦 Aplicando nuevas tablas...");

// Crear tablas manualmente
const tables = [
  `CREATE TABLE IF NOT EXISTS notasCredito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ventaId INTEGER NOT NULL REFERENCES ventas(id),
    numeroNota TEXT NOT NULL UNIQUE,
    motivo TEXT NOT NULL,
    monto REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    aplicadaEn INTEGER,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS detallesNotaCredito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notaCreditoId INTEGER REFERENCES notasCredito(id),
    productoId INTEGER NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precioUnitario REAL NOT NULL,
    subtotal REAL NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS cortesCaja (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId INTEGER NOT NULL REFERENCES usuarios(id),
    fechaApertura INTEGER NOT NULL,
    fechaCierre INTEGER,
    montoInicial REAL NOT NULL,
    ventasEfectivo REAL NOT NULL DEFAULT 0,
    ventasTarjeta REAL NOT NULL DEFAULT 0,
    ventasTransferencia REAL NOT NULL DEFAULT 0,
    totalVentas REAL NOT NULL DEFAULT 0,
    montoEsperado REAL NOT NULL DEFAULT 0,
    montoReal REAL,
    diferencia REAL,
    estado TEXT NOT NULL DEFAULT 'abierto',
    notas TEXT,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS configuracion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreEmpresa TEXT NOT NULL,
    rtn TEXT,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    moneda TEXT NOT NULL DEFAULT 'HNL',
    simboloMoneda TEXT NOT NULL DEFAULT 'L',
    tasaImpuesto REAL NOT NULL DEFAULT 0.15,
    nombreImpuesto TEXT NOT NULL DEFAULT 'ISV',
    cai TEXT,
    rangoInicio TEXT,
    rangoFin TEXT,
    fechaLimiteEmision INTEGER,
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS ventasCredito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ventaId INTEGER NOT NULL REFERENCES ventas(id),
    clienteId INTEGER NOT NULL REFERENCES clientes(id),
    montoTotal REAL NOT NULL,
    montoPagado REAL NOT NULL DEFAULT 0,
    saldo REAL NOT NULL,
    fechaVencimiento INTEGER NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    createdAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS pagosCredito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ventaCreditoId INTEGER NOT NULL REFERENCES ventasCredito(id),
    monto REAL NOT NULL,
    metodoPago TEXT NOT NULL,
    referencia TEXT,
    notas TEXT,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS promociones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT NOT NULL,
    valor REAL NOT NULL,
    aplicaA TEXT NOT NULL,
    productoId INTEGER REFERENCES productos(id),
    clienteId INTEGER REFERENCES clientes(id),
    fechaInicio INTEGER NOT NULL,
    fechaFin INTEGER NOT NULL,
    activa INTEGER NOT NULL DEFAULT 1,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS librosSAR (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha INTEGER NOT NULL,
    numeroFactura TEXT NOT NULL,
    clienteNombre TEXT NOT NULL,
    clienteRTN TEXT,
    exentas REAL NOT NULL DEFAULT 0,
    gravadas15 REAL NOT NULL DEFAULT 0,
    isv15 REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    tipo TEXT NOT NULL,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS consumibles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productoId INTEGER NOT NULL REFERENCES productos(id),
    unidadMedida TEXT NOT NULL,
    cantidadPorUnidad REAL NOT NULL,
    stockActual REAL NOT NULL,
    stockMinimo REAL,
    ultimaRecarga INTEGER,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  `CREATE TABLE IF NOT EXISTS movimientosConsumibles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consumibleId INTEGER NOT NULL REFERENCES consumibles(id),
    tipo TEXT NOT NULL,
    cantidad REAL NOT NULL,
    cantidadAnterior REAL NOT NULL,
    cantidadNueva REAL NOT NULL,
    motivo TEXT,
    usuarioId INTEGER REFERENCES usuarios(id),
    createdAt INTEGER NOT NULL DEFAULT (unixepoch())
  )`,
  // Insertar configuración por defecto
  `INSERT OR IGNORE INTO configuracion (id, nombreEmpresa, rtn, telefono, direccion, moneda, simboloMoneda, tasaImpuesto, nombreImpuesto)
   VALUES (1, 'Creativos Gift Shop', '0000-0000-000000', '+504 0000-0000', 'Honduras', 'HNL', 'L', 0.15, 'ISV')`
];

for (const sql of tables) {
  try {
    sqlite.exec(sql);
  } catch (error) {
    console.log("⚠️  Tabla ya existe o error:", error.message);
  }
}

console.log("✅ Tablas creadas exitosamente");
sqlite.close();
