import { mysqlTable, int, integer, varchar, text, boolean, timestamp, double } from "drizzle-orm/mysql-core";

/**
 * CREATIVOS GIFT SHOP POS v2.0 - MySQL/TiDB Schema
 * Sistema POS profesional con cumplimiento SAR Honduras
 * Convertido desde SQLite para producción
 */

// ============================================
// TABLAS PRINCIPALES
// ============================================

/**
 * Usuarios del sistema (vendedores, gerentes, admin)
 */
export const usuarios = mysqlTable("usuarios", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  openId: varchar("openId", { length: 255 }).unique(),
  nombre: text("nombre"),
  email: varchar("email", { length: 320 }).unique(),
  password: text("password"),
  loginMethod: varchar("loginMethod", { length: 100 }),
  rol: varchar("rol", { length: 20 }).default("vendedor").notNull(),
  sucursalId: int("sucursalId"),
  activo: boolean("activo").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { mode: "date" }),
});

export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = typeof usuarios.$inferInsert;
export type User = Usuario;
export type InsertUser = InsertUsuario;

/**
 * Sucursales
 */
export const sucursales = mysqlTable("sucursales", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  nombre: text("nombre").notNull(),
  direccion: text("direccion"),
  telefono: varchar("telefono", { length: 20 }),
  rtn: varchar("rtn", { length: 20 }),
  cai: varchar("cai", { length: 100 }),
  rangoInicio: varchar("rangoInicio", { length: 50 }),
  rangoFin: varchar("rangoFin", { length: 50 }),
  fechaLimiteEmision: timestamp("fechaLimiteEmision", { mode: "date" }),
  activo: boolean("activo").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Sucursal = typeof sucursales.$inferSelect;
export type InsertSucursal = typeof sucursales.$inferInsert;

/**
 * Productos
 */
export const productos = mysqlTable("productos", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  codigo: varchar("codigo", { length: 100 }).unique().notNull(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  precio: double("precio").notNull(),
  costo: double("costo"),
  stock: int("stock").default(0).notNull(),
  stockMinimo: int("stockMinimo").default(0),
  categoria: varchar("categoria", { length: 100 }),
  proveedor: varchar("proveedor", { length: 255 }),
  imagen: text("imagen"),
  activo: boolean("activo").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Producto = typeof productos.$inferSelect;
export type InsertProducto = typeof productos.$inferInsert;

/**
 * Clientes
 */
export const clientes = mysqlTable("clientes", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  nombre: text("nombre").notNull(),
  rtn: varchar("rtn", { length: 20 }),
  telefono: varchar("telefono", { length: 20 }),
  email: varchar("email", { length: 320 }),
  direccion: text("direccion"),
  nivel: varchar("nivel", { length: 20 }).default("bronce"),
  descuento: double("descuento").default(0),
  credito: double("credito").default(0),
  activo: boolean("activo").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

/**
 * Ventas
 */
export const ventas = mysqlTable("ventas", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  numeroFactura: varchar("numeroFactura", { length: 100 }).unique().notNull(),
  clienteId: int("clienteId"),
  usuarioId: int("usuarioId").notNull(),
  sucursalId: int("sucursalId").notNull(),
  subtotal: double("subtotal").notNull(),
  descuento: double("descuento").default(0),
  impuesto: double("impuesto").default(0),
  total: double("total").notNull(),
  metodoPago: varchar("metodoPago", { length: 50 }).notNull(),
  efectivo: double("efectivo"),
  tarjeta: double("tarjeta"),
  transferencia: double("transferencia"),
  cambio: double("cambio"),
  notas: text("notas"),
  anulada: boolean("anulada").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Venta = typeof ventas.$inferSelect;
export type InsertVenta = typeof ventas.$inferInsert;

/**
 * Detalles de venta
 */
export const detallesVenta = mysqlTable("detallesVenta", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  ventaId: int("ventaId"),
  productoId: int("productoId").notNull(),
  cantidad: int("cantidad").notNull(),
  precioUnitario: double("precioUnitario").notNull(),
  descuento: double("descuento").default(0),
  subtotal: double("subtotal").notNull(),
});

export type DetalleVenta = typeof detallesVenta.$inferSelect;
export type InsertDetalleVenta = typeof detallesVenta.$inferInsert;

/**
 * Cotizaciones
 */
export const cotizaciones = mysqlTable("cotizaciones", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  numero: varchar("numero", { length: 100 }).unique().notNull(),
  clienteId: int("clienteId"),
  usuarioId: int("usuarioId").notNull(),
  sucursalId: int("sucursalId").notNull(),
  subtotal: double("subtotal").notNull(),
  descuento: double("descuento").default(0),
  impuesto: double("impuesto").default(0),
  total: double("total").notNull(),
  estado: varchar("estado", { length: 20 }).default("Pendiente"),
  validezDias: int("validezDias").default(30),
  notas: text("notas"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Cotizacion = typeof cotizaciones.$inferSelect;
export type InsertCotizacion = typeof cotizaciones.$inferInsert;

/**
 * Detalles de cotización
 */
export const detallesCotizacion = mysqlTable("detallesCotizacion", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  cotizacionId: int("cotizacionId"),
  productoId: int("productoId").notNull(),
  cantidad: int("cantidad").notNull(),
  precioUnitario: double("precioUnitario").notNull(),
  descuento: double("descuento").default(0),
  subtotal: double("subtotal").notNull(),
});

export type DetalleCotizacion = typeof detallesCotizacion.$inferSelect;
export type InsertDetalleCotizacion = typeof detallesCotizacion.$inferInsert;

/**
 * Notas de crédito
 */
export const notasCredito = mysqlTable("notasCredito", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  ventaId: int("ventaId").notNull(),
  numeroNota: varchar("numeroNota", { length: 100 }).notNull().unique(),
  motivo: text("motivo").notNull(),
  monto: double("monto").notNull(),
  estado: varchar("estado", { length: 20 }).notNull().default("pendiente"),
  aplicadaEn: int("aplicadaEn"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type NotaCredito = typeof notasCredito.$inferSelect;
export type InsertNotaCredito = typeof notasCredito.$inferInsert;

export const detallesNotaCredito = mysqlTable("detallesNotaCredito", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  notaCreditoId: int("notaCreditoId"),
  productoId: int("productoId").notNull(),
  cantidad: int("cantidad").notNull(),
  precioUnitario: double("precioUnitario").notNull(),
  subtotal: double("subtotal").notNull(),
});

export type DetalleNotaCredito = typeof detallesNotaCredito.$inferSelect;
export type InsertDetalleNotaCredito = typeof detallesNotaCredito.$inferInsert;

/**
 * Corte de caja
 */
export const cortesCaja = mysqlTable("cortesCaja", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  usuarioId: int("usuarioId").notNull(),
  fechaApertura: timestamp("fechaApertura", { mode: "date" }).notNull(),
  fechaCierre: timestamp("fechaCierre", { mode: "date" }),
  montoInicial: double("montoInicial").notNull(),
  ventasEfectivo: double("ventasEfectivo").notNull().default(0),
  ventasTarjeta: double("ventasTarjeta").notNull().default(0),
  ventasTransferencia: double("ventasTransferencia").notNull().default(0),
  totalVentas: double("totalVentas").notNull().default(0),
  montoEsperado: double("montoEsperado").notNull().default(0),
  montoReal: double("montoReal"),
  diferencia: double("diferencia"),
  estado: varchar("estado", { length: 20 }).notNull().default("abierto"),
  notas: text("notas"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type CorteCaja = typeof cortesCaja.$inferSelect;
export type InsertCorteCaja = typeof cortesCaja.$inferInsert;

/**
 * Configuración
 */
export const configuracion = mysqlTable("configuracion", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  nombreTienda: text("nombreTienda").notNull().default("Creativos Gift Shop POS v2.0"),
  nombreEmpresa: text("nombreEmpresa").notNull(),
  rtn: varchar("rtn", { length: 20 }),
  telefono: varchar("telefono", { length: 20 }),
  email: varchar("email", { length: 320 }),
  direccion: text("direccion"),
  moneda: varchar("moneda", { length: 10 }).notNull().default("HNL"),
  simboloMoneda: varchar("simboloMoneda", { length: 5 }).notNull().default("L"),
  tasaImpuesto: double("tasaImpuesto").notNull().default(0.15),
  nombreImpuesto: varchar("nombreImpuesto", { length: 50 }).notNull().default("ISV"),
  cai: varchar("cai", { length: 100 }),
  rangoInicio: varchar("rangoInicio", { length: 50 }),
  rangoFin: varchar("rangoFin", { length: 50 }),
  fechaLimiteEmision: timestamp("fechaLimiteEmision", { mode: "date" }),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Configuracion = typeof configuracion.$inferSelect;
export type InsertConfiguracion = typeof configuracion.$inferInsert;

/**
 * Ventas a crédito
 */
export const ventasCredito = mysqlTable("ventasCredito", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  ventaId: int("ventaId").notNull(),
  clienteId: int("clienteId").notNull(),
  montoTotal: double("montoTotal").notNull(),
  montoPagado: double("montoPagado").notNull().default(0),
  saldo: double("saldo").notNull(),
  fechaVencimiento: timestamp("fechaVencimiento", { mode: "date" }).notNull(),
  estado: varchar("estado", { length: 20 }).notNull().default("pendiente"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type VentaCredito = typeof ventasCredito.$inferSelect;
export type InsertVentaCredito = typeof ventasCredito.$inferInsert;

export const pagosCredito = mysqlTable("pagosCredito", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  ventaCreditoId: int("ventaCreditoId").notNull(),
  monto: double("monto").notNull(),
  metodoPago: varchar("metodoPago", { length: 50 }).notNull(),
  referencia: varchar("referencia", { length: 255 }),
  notas: text("notas"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type PagoCredito = typeof pagosCredito.$inferSelect;
export type InsertPagoCredito = typeof pagosCredito.$inferInsert;

/**
 * Promociones
 */
export const promociones = mysqlTable("promociones", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  valor: double("valor").notNull(),
  aplicaA: varchar("aplicaA", { length: 20 }).notNull(),
  productoId: int("productoId"),
  clienteId: int("clienteId"),
  fechaInicio: timestamp("fechaInicio", { mode: "date" }).notNull(),
  fechaFin: timestamp("fechaFin", { mode: "date" }).notNull(),
  activa: boolean("activa").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Promocion = typeof promociones.$inferSelect;
export type InsertPromocion = typeof promociones.$inferInsert;

/**
 * Libros SAR
 */
export const librosSAR = mysqlTable("librosSAR", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  fecha: timestamp("fecha", { mode: "date" }).notNull(),
  numeroFactura: varchar("numeroFactura", { length: 100 }).notNull(),
  clienteNombre: text("clienteNombre").notNull(),
  clienteRTN: varchar("clienteRTN", { length: 20 }),
  exentas: double("exentas").notNull().default(0),
  gravadas15: double("gravadas15").notNull().default(0),
  isv15: double("isv15").notNull().default(0),
  total: double("total").notNull(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type LibroSAR = typeof librosSAR.$inferSelect;
export type InsertLibroSAR = typeof librosSAR.$inferInsert;

/**
 * Consumibles
 */
export const consumibles = mysqlTable("consumibles", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  productoId: int("productoId").notNull(),
  unidadMedida: varchar("unidadMedida", { length: 50 }).notNull(),
  cantidadPorUnidad: double("cantidadPorUnidad").notNull(),
  stockActual: double("stockActual").notNull(),
  stockMinimo: double("stockMinimo"),
  ultimaRecarga: timestamp("ultimaRecarga", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type Consumible = typeof consumibles.$inferSelect;
export type InsertConsumible = typeof consumibles.$inferInsert;

export const movimientosConsumibles = mysqlTable("movimientosConsumibles", {
  id: int("id", { primaryKey: true, autoIncrement: true }),
  consumibleId: int("consumibleId").notNull(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  cantidad: double("cantidad").notNull(),
  cantidadAnterior: double("cantidadAnterior").notNull(),
  cantidadNueva: double("cantidadNueva").notNull(),
  motivo: text("motivo"),
  usuarioId: int("usuarioId"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type MovimientoConsumible = typeof movimientosConsumibles.$inferSelect;
export type InsertMovimientoConsumible = typeof movimientosConsumibles.$inferInsert;
