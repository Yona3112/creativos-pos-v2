-- Crear todas las tablas del esquema PostgreSQL

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(255) UNIQUE,
  nombre TEXT,
  email VARCHAR(320) UNIQUE,
  password TEXT,
  "loginMethod" VARCHAR(100),
  rol VARCHAR(20) DEFAULT 'vendedor' NOT NULL,
  "sucursalId" INTEGER,
  activo BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "lastSignedIn" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sucursales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT,
  telefono VARCHAR(20),
  rtn VARCHAR(20),
  cai VARCHAR(100),
  "rangoInicio" VARCHAR(50),
  "rangoFin" VARCHAR(50),
  "fechaLimiteEmision" TIMESTAMP,
  activo BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(100) UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  costo DECIMAL(10,2),
  stock INTEGER DEFAULT 0 NOT NULL,
  "stockMinimo" INTEGER DEFAULT 0,
  categoria VARCHAR(100),
  proveedor VARCHAR(255),
  imagen TEXT,
  activo BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  rtn VARCHAR(20),
  telefono VARCHAR(20),
  email VARCHAR(320),
  direccion TEXT,
  nivel VARCHAR(20) DEFAULT 'bronce',
  descuento DECIMAL(5,2) DEFAULT 0,
  credito DECIMAL(10,2) DEFAULT 0,
  activo BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  "numeroFactura" VARCHAR(100) UNIQUE NOT NULL,
  "clienteId" INTEGER,
  "usuarioId" INTEGER NOT NULL,
  "sucursalId" INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  impuesto DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  "metodoPago" VARCHAR(50) NOT NULL,
  efectivo DECIMAL(10,2),
  tarjeta DECIMAL(10,2),
  transferencia DECIMAL(10,2),
  cambio DECIMAL(10,2),
  notas TEXT,
  anulada BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "detallesVenta" (
  id SERIAL PRIMARY KEY,
  "ventaId" INTEGER,
  "productoId" INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  "precioUnitario" DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS cotizaciones (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(100) UNIQUE NOT NULL,
  "clienteId" INTEGER,
  "usuarioId" INTEGER NOT NULL,
  "sucursalId" INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  impuesto DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'Pendiente',
  "validezDias" INTEGER DEFAULT 30,
  notas TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "detallesCotizacion" (
  id SERIAL PRIMARY KEY,
  "cotizacionId" INTEGER,
  "productoId" INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  "precioUnitario" DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "notasCredito" (
  id SERIAL PRIMARY KEY,
  "ventaId" INTEGER NOT NULL,
  "numeroNota" VARCHAR(100) UNIQUE NOT NULL,
  motivo TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' NOT NULL,
  "aplicadaEn" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "detallesNotaCredito" (
  id SERIAL PRIMARY KEY,
  "notaCreditoId" INTEGER,
  "productoId" INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  "precioUnitario" DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "cortesCaja" (
  id SERIAL PRIMARY KEY,
  "usuarioId" INTEGER NOT NULL,
  "fechaApertura" TIMESTAMP NOT NULL,
  "fechaCierre" TIMESTAMP,
  "montoInicial" DECIMAL(10,2) NOT NULL,
  "ventasEfectivo" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  "ventasTarjeta" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  "ventasTransferencia" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  "totalVentas" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  "montoEsperado" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  "montoReal" DECIMAL(10,2),
  diferencia DECIMAL(10,2),
  estado VARCHAR(20) DEFAULT 'abierto' NOT NULL,
  notas TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS configuracion (
  id SERIAL PRIMARY KEY,
  "nombreTienda" TEXT DEFAULT 'Creativos Gift Shop POS v2.0' NOT NULL,
  "nombreEmpresa" TEXT NOT NULL,
  rtn VARCHAR(20),
  telefono VARCHAR(20),
  email VARCHAR(320),
  direccion TEXT,
  moneda VARCHAR(10) DEFAULT 'HNL' NOT NULL,
  "simboloMoneda" VARCHAR(5) DEFAULT 'L' NOT NULL,
  "tasaImpuesto" DECIMAL(5,4) DEFAULT 0.15 NOT NULL,
  "nombreImpuesto" VARCHAR(50) DEFAULT 'ISV' NOT NULL,
  cai VARCHAR(100),
  "rangoInicio" VARCHAR(50),
  "rangoFin" VARCHAR(50),
  "fechaLimiteEmision" TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ventasCredito" (
  id SERIAL PRIMARY KEY,
  "ventaId" INTEGER NOT NULL,
  "clienteId" INTEGER NOT NULL,
  "montoTotal" DECIMAL(10,2) NOT NULL,
  "montoPagado" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  saldo DECIMAL(10,2) NOT NULL,
  "fechaVencimiento" TIMESTAMP NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "pagosCredito" (
  id SERIAL PRIMARY KEY,
  "ventaCreditoId" INTEGER NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  "metodoPago" VARCHAR(50) NOT NULL,
  referencia VARCHAR(255),
  notas TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS promociones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(20) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  "aplicaA" VARCHAR(20) NOT NULL,
  "productoId" INTEGER,
  "clienteId" INTEGER,
  "fechaInicio" TIMESTAMP NOT NULL,
  "fechaFin" TIMESTAMP NOT NULL,
  activa BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "librosSAR" (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMP NOT NULL,
  "numeroFactura" VARCHAR(100) NOT NULL,
  "clienteNombre" TEXT NOT NULL,
  "clienteRTN" VARCHAR(20),
  exentas DECIMAL(10,2) DEFAULT 0 NOT NULL,
  gravadas15 DECIMAL(10,2) DEFAULT 0 NOT NULL,
  isv15 DECIMAL(10,2) DEFAULT 0 NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS consumibles (
  id SERIAL PRIMARY KEY,
  "productoId" INTEGER NOT NULL,
  "unidadMedida" VARCHAR(50) NOT NULL,
  "cantidadPorUnidad" DECIMAL(10,2) NOT NULL,
  "stockActual" DECIMAL(10,2) NOT NULL,
  "stockMinimo" DECIMAL(10,2),
  "ultimaRecarga" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "movimientosConsumibles" (
  id SERIAL PRIMARY KEY,
  "consumibleId" INTEGER NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  "cantidadAnterior" DECIMAL(10,2) NOT NULL,
  "cantidadNueva" DECIMAL(10,2) NOT NULL,
  motivo TEXT,
  "usuarioId" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);
