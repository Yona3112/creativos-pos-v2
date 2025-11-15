-- Convertir todas las columnas numeric a double precision

-- Tabla productos
ALTER TABLE productos ALTER COLUMN precio TYPE double precision;
ALTER TABLE productos ALTER COLUMN costo TYPE double precision;

-- Tabla clientes
ALTER TABLE clientes ALTER COLUMN descuento TYPE double precision;
ALTER TABLE clientes ALTER COLUMN credito TYPE double precision;

-- Tabla ventas
ALTER TABLE ventas ALTER COLUMN subtotal TYPE double precision;
ALTER TABLE ventas ALTER COLUMN descuento TYPE double precision;
ALTER TABLE ventas ALTER COLUMN impuesto TYPE double precision;
ALTER TABLE ventas ALTER COLUMN total TYPE double precision;
ALTER TABLE ventas ALTER COLUMN efectivo TYPE double precision;
ALTER TABLE ventas ALTER COLUMN tarjeta TYPE double precision;
ALTER TABLE ventas ALTER COLUMN transferencia TYPE double precision;
ALTER TABLE ventas ALTER COLUMN cambio TYPE double precision;

-- Tabla detallesVenta
ALTER TABLE "detallesVenta" ALTER COLUMN "precioUnitario" TYPE double precision;
ALTER TABLE "detallesVenta" ALTER COLUMN descuento TYPE double precision;
ALTER TABLE "detallesVenta" ALTER COLUMN subtotal TYPE double precision;

-- Tabla cotizaciones
ALTER TABLE cotizaciones ALTER COLUMN subtotal TYPE double precision;
ALTER TABLE cotizaciones ALTER COLUMN descuento TYPE double precision;
ALTER TABLE cotizaciones ALTER COLUMN impuesto TYPE double precision;
ALTER TABLE cotizaciones ALTER COLUMN total TYPE double precision;

-- Tabla detallesCotizacion
ALTER TABLE "detallesCotizacion" ALTER COLUMN "precioUnitario" TYPE double precision;
ALTER TABLE "detallesCotizacion" ALTER COLUMN descuento TYPE double precision;
ALTER TABLE "detallesCotizacion" ALTER COLUMN subtotal TYPE double precision;

-- Tabla notasCredito
ALTER TABLE "notasCredito" ALTER COLUMN monto TYPE double precision;

-- Tabla detallesNotaCredito
ALTER TABLE "detallesNotaCredito" ALTER COLUMN "precioUnitario" TYPE double precision;
ALTER TABLE "detallesNotaCredito" ALTER COLUMN subtotal TYPE double precision;

-- Tabla cortesCaja
ALTER TABLE "cortesCaja" ALTER COLUMN "montoInicial" TYPE double precision;
ALTER TABLE "cortesCaja" ALTER COLUMN "ventasEfectivo" TYPE double precision;
ALTER TABLE "cortesCaja" ALTER COLUMN "ventasTarjeta" TYPE double precision;
ALTER TABLE "cortesCaja" ALTER COLUMN "ventasTransferencia" TYPE double precision;
ALTER TABLE "cortesCaja" ALTER COLUMN "totalVentas" TYPE double precision;
ALTER TABLE "cortesCaja" ALTER COLUMN "montoEsperado" TYPE double precision;
ALTER TABLE "cortesCaja" ALTER COLUMN "montoReal" TYPE double precision;
ALTER TABLE "cortesCaja" ALTER COLUMN diferencia TYPE double precision;

-- Tabla configuracion
ALTER TABLE configuracion ALTER COLUMN "tasaImpuesto" TYPE double precision;

-- Tabla ventasCredito
ALTER TABLE "ventasCredito" ALTER COLUMN "montoTotal" TYPE double precision;
ALTER TABLE "ventasCredito" ALTER COLUMN "montoPagado" TYPE double precision;
ALTER TABLE "ventasCredito" ALTER COLUMN saldo TYPE double precision;

-- Tabla promociones
ALTER TABLE promociones ALTER COLUMN valor TYPE double precision;

-- Tabla librosSAR
ALTER TABLE "librosSAR" ALTER COLUMN exentas TYPE double precision;
ALTER TABLE "librosSAR" ALTER COLUMN gravadas15 TYPE double precision;
ALTER TABLE "librosSAR" ALTER COLUMN isv15 TYPE double precision;
ALTER TABLE "librosSAR" ALTER COLUMN total TYPE double precision;
