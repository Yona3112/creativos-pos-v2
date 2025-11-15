import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * CREATIVOS GIFT SHOP POS v2.0 - SQLite Schema
 * Sistema POS profesional con cumplimiento SAR Honduras
 */

// ============================================
// TABLAS PRINCIPALES
// ============================================

/**
 * Usuarios del sistema (vendedores, gerentes, admin)
 */
export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").unique(),
  nombre: text("nombre"),
  email: text("email").unique(),
  password: text("password"),
  loginMethod: text("loginMethod"),
  rol: text("rol", { enum: ["admin", "vendedor", "gerente"] }).default("vendedor").notNull(),
  sucursalId: integer("sucursalId"),
  activo: integer("activo", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }),
});

export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = typeof usuarios.$inferInsert;
export type User = Usuario;
export type InsertUser = InsertUsuario;

/**
 * Sucursales
 */
export const sucursales = sqliteTable("sucursales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  direccion: text("direccion"),
  telefono: text("telefono"),
  rtn: text("rtn"),
  cai: text("cai"),
  rangoInicio: text("rangoInicio"),
  rangoFin: text("rangoFin"),
  fechaLimiteEmision: integer("fechaLimiteEmision", { mode: "timestamp" }),
  activo: integer("activo", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

/**
 * Productos
 */
export const productos = sqliteTable("productos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  codigo: text("codigo").unique().notNull(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  precio: real("precio").notNull(),
  costo: real("costo"),
  stock: integer("stock").default(0).notNull(),
  stockMinimo: integer("stockMinimo").default(0),
  categoria: text("categoria"),
  proveedor: text("proveedor"),
  imagen: text("imagen"),
  activo: integer("activo", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Producto = typeof productos.$inferSelect;
export type InsertProducto = typeof productos.$inferInsert;

/**
 * Clientes
 */
export const clientes = sqliteTable("clientes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  rtn: text("rtn"),
  telefono: text("telefono"),
  email: text("email"),
  direccion: text("direccion"),
  nivel: text("nivel", { enum: ["bronce", "plata", "oro", "platino"] }).default("bronce"),
  descuento: real("descuento").default(0),
  credito: real("credito").default(0),
  activo: integer("activo", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

/**
 * Ventas
 */
export const ventas = sqliteTable("ventas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  numeroFactura: text("numeroFactura").unique().notNull(),
  clienteId: integer("clienteId"),
  usuarioId: integer("usuarioId").notNull(),
  sucursalId: integer("sucursalId").notNull(),
  subtotal: real("subtotal").notNull(),
  descuento: real("descuento").default(0),
  impuesto: real("impuesto").default(0),
  total: real("total").notNull(),
  metodoPago: text("metodoPago", { enum: ["Efectivo", "Tarjeta", "Transferencia", "Mixto"] }).notNull(),
  efectivo: real("efectivo"),
  tarjeta: real("tarjeta"),
  transferencia: real("transferencia"),
  cambio: real("cambio"),
  notas: text("notas"),
  anulada: integer("anulada", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

/**
 * Detalles de venta
 */
export const detallesVenta = sqliteTable("detallesVenta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ventaId: integer("ventaId"),
  productoId: integer("productoId").notNull(),
  cantidad: integer("cantidad").notNull(),
  precioUnitario: real("precioUnitario").notNull(),
  descuento: real("descuento").default(0),
  subtotal: real("subtotal").notNull(),
});

/**
 * Cotizaciones
 */
export const cotizaciones = sqliteTable("cotizaciones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  numero: text("numero").unique().notNull(),
  clienteId: integer("clienteId"),
  usuarioId: integer("usuarioId").notNull(),
  sucursalId: integer("sucursalId").notNull(),
  subtotal: real("subtotal").notNull(),
  descuento: real("descuento").default(0),
  impuesto: real("impuesto").default(0),
  total: real("total").notNull(),
  estado: text("estado", { enum: ["Pendiente", "Aprobada", "Rechazada", "Convertida"] }).default("Pendiente"),
  validezDias: integer("validezDias").default(30),
  notas: text("notas"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

/**
 * Detalles de cotización
 */
export const detallesCotizacion = sqliteTable("detallesCotizacion", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cotizacionId: integer("cotizacionId"),
  productoId: integer("productoId").notNull(),
  cantidad: integer("cantidad").notNull(),
  precioUnitario: real("precioUnitario").notNull(),
  descuento: real("descuento").default(0),
  subtotal: real("subtotal").notNull(),
});

/**
 * Notas de crédito
 */
// ========== NOTAS DE CRÉDITO ==========
export const notasCredito = sqliteTable("notasCredito", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ventaId: integer("ventaId").notNull().references(() => ventas.id),
  numeroNota: text("numeroNota").notNull().unique(),
  motivo: text("motivo").notNull(),
  monto: real("monto").notNull(),
  estado: text("estado", { enum: ["pendiente", "aplicada", "anulada"] }).notNull().default("pendiente"),
  aplicadaEn: integer("aplicadaEn"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const detallesNotaCredito = sqliteTable("detallesNotaCredito", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  notaCreditoId: integer("notaCreditoId").references(() => notasCredito.id),
  productoId: integer("productoId").notNull().references(() => productos.id),
  cantidad: integer("cantidad").notNull(),
  precioUnitario: real("precioUnitario").notNull(),
  subtotal: real("subtotal").notNull(),
});

// ========== CORTE DE CAJA ==========
export const cortesCaja = sqliteTable("cortesCaja", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: integer("usuarioId").notNull().references(() => usuarios.id),
  fechaApertura: integer("fechaApertura", { mode: "timestamp" }).notNull(),
  fechaCierre: integer("fechaCierre", { mode: "timestamp" }),
  montoInicial: real("montoInicial").notNull(),
  ventasEfectivo: real("ventasEfectivo").notNull().default(0),
  ventasTarjeta: real("ventasTarjeta").notNull().default(0),
  ventasTransferencia: real("ventasTransferencia").notNull().default(0),
  totalVentas: real("totalVentas").notNull().default(0),
  montoEsperado: real("montoEsperado").notNull().default(0),
  montoReal: real("montoReal"),
  diferencia: real("diferencia"),
  estado: text("estado", { enum: ["abierto", "cerrado"] }).notNull().default("abierto"),
  notas: text("notas"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// ========== CONFIGURACIÓN ==========
export const configuracion = sqliteTable("configuracion", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombreTienda: text("nombreTienda").notNull().default("Creativos Gift Shop POS v2.0"),
  nombreEmpresa: text("nombreEmpresa").notNull(),
  rtn: text("rtn"),
  telefono: text("telefono"),
  email: text("email"),
  direccion: text("direccion"),
  moneda: text("moneda").notNull().default("HNL"),
  simboloMoneda: text("simboloMoneda").notNull().default("L"),
  tasaImpuesto: real("tasaImpuesto").notNull().default(0.15),
  nombreImpuesto: text("nombreImpuesto").notNull().default("ISV"),
  cai: text("cai"),
  rangoInicio: text("rangoInicio"),
  rangoFin: text("rangoFin"),
  fechaLimiteEmision: integer("fechaLimiteEmision", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// ========== CRÉDITO ==========
export const ventasCredito = sqliteTable("ventasCredito", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ventaId: integer("ventaId").notNull().references(() => ventas.id),
  clienteId: integer("clienteId").notNull().references(() => clientes.id),
  montoTotal: real("montoTotal").notNull(),
  montoPagado: real("montoPagado").notNull().default(0),
  saldo: real("saldo").notNull(),
  fechaVencimiento: integer("fechaVencimiento", { mode: "timestamp" }).notNull(),
  estado: text("estado", { enum: ["pendiente", "pagado", "vencido"] }).notNull().default("pendiente"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const pagosCredito = sqliteTable("pagosCredito", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ventaCreditoId: integer("ventaCreditoId").notNull().references(() => ventasCredito.id),
  monto: real("monto").notNull(),
  metodoPago: text("metodoPago").notNull(),
  referencia: text("referencia"),
  notas: text("notas"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// ========== PROMOCIONES ==========
export const promociones = sqliteTable("promociones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  tipo: text("tipo", { enum: ["porcentaje", "monto_fijo", "2x1", "3x2"] }).notNull(),
  valor: real("valor").notNull(),
  aplicaA: text("aplicaA", { enum: ["producto", "categoria", "cliente", "todos"] }).notNull(),
  productoId: integer("productoId").references(() => productos.id),
  clienteId: integer("clienteId").references(() => clientes.id),
  fechaInicio: integer("fechaInicio", { mode: "timestamp" }).notNull(),
  fechaFin: integer("fechaFin", { mode: "timestamp" }).notNull(),
  activa: integer("activa", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// ========== LIBROS SAR ==========
export const librosSAR = sqliteTable("librosSAR", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fecha: integer("fecha", { mode: "timestamp" }).notNull(),
  numeroFactura: text("numeroFactura").notNull(),
  clienteNombre: text("clienteNombre").notNull(),
  clienteRTN: text("clienteRTN"),
  exentas: real("exentas").notNull().default(0),
  gravadas15: real("gravadas15").notNull().default(0),
  isv15: real("isv15").notNull().default(0),
  total: real("total").notNull(),
  tipo: text("tipo", { enum: ["venta", "compra"] }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// ========== CONSUMIBLES ==========
export const consumibles = sqliteTable("consumibles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productoId: integer("productoId").notNull().references(() => productos.id),
  unidadMedida: text("unidadMedida").notNull(),
  cantidadPorUnidad: real("cantidadPorUnidad").notNull(),
  stockActual: real("stockActual").notNull(),
  stockMinimo: real("stockMinimo"),
  ultimaRecarga: integer("ultimaRecarga", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const movimientosConsumibles = sqliteTable("movimientosConsumibles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  consumibleId: integer("consumibleId").notNull().references(() => consumibles.id),
  tipo: text("tipo", { enum: ["entrada", "salida", "ajuste"] }).notNull(),
  cantidad: real("cantidad").notNull(),
  cantidadAnterior: real("cantidadAnterior").notNull(),
  cantidadNueva: real("cantidadNueva").notNull(),
  motivo: text("motivo"),
  usuarioId: integer("usuarioId").references(() => usuarios.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});
