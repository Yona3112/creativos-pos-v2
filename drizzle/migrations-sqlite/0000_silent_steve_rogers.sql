CREATE TABLE `clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`rtn` text,
	`telefono` text,
	`email` text,
	`direccion` text,
	`nivel` text DEFAULT 'bronce',
	`descuento` real DEFAULT 0,
	`credito` real DEFAULT 0,
	`activo` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `configuracion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombreTienda` text DEFAULT 'Creativos Gift Shop POS v2.0' NOT NULL,
	`nombreEmpresa` text NOT NULL,
	`rtn` text,
	`telefono` text,
	`email` text,
	`direccion` text,
	`moneda` text DEFAULT 'HNL' NOT NULL,
	`simboloMoneda` text DEFAULT 'L' NOT NULL,
	`tasaImpuesto` real DEFAULT 0.15 NOT NULL,
	`nombreImpuesto` text DEFAULT 'ISV' NOT NULL,
	`cai` text,
	`rangoInicio` text,
	`rangoFin` text,
	`fechaLimiteEmision` integer,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `consumibles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productoId` integer NOT NULL,
	`unidadMedida` text NOT NULL,
	`cantidadPorUnidad` real NOT NULL,
	`stockActual` real NOT NULL,
	`stockMinimo` real,
	`ultimaRecarga` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`productoId`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cortesCaja` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuarioId` integer NOT NULL,
	`fechaApertura` integer NOT NULL,
	`fechaCierre` integer,
	`montoInicial` real NOT NULL,
	`ventasEfectivo` real DEFAULT 0 NOT NULL,
	`ventasTarjeta` real DEFAULT 0 NOT NULL,
	`ventasTransferencia` real DEFAULT 0 NOT NULL,
	`totalVentas` real DEFAULT 0 NOT NULL,
	`montoEsperado` real DEFAULT 0 NOT NULL,
	`montoReal` real,
	`diferencia` real,
	`estado` text DEFAULT 'abierto' NOT NULL,
	`notas` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cotizaciones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numero` text NOT NULL,
	`clienteId` integer,
	`usuarioId` integer NOT NULL,
	`sucursalId` integer NOT NULL,
	`subtotal` real NOT NULL,
	`descuento` real DEFAULT 0,
	`impuesto` real DEFAULT 0,
	`total` real NOT NULL,
	`estado` text DEFAULT 'Pendiente',
	`validezDias` integer DEFAULT 30,
	`notas` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cotizaciones_numero_unique` ON `cotizaciones` (`numero`);--> statement-breakpoint
CREATE TABLE `detallesCotizacion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cotizacionId` integer,
	`productoId` integer NOT NULL,
	`cantidad` integer NOT NULL,
	`precioUnitario` real NOT NULL,
	`descuento` real DEFAULT 0,
	`subtotal` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `detallesNotaCredito` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`notaCreditoId` integer,
	`productoId` integer NOT NULL,
	`cantidad` integer NOT NULL,
	`precioUnitario` real NOT NULL,
	`subtotal` real NOT NULL,
	FOREIGN KEY (`notaCreditoId`) REFERENCES `notasCredito`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productoId`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `detallesVenta` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ventaId` integer,
	`productoId` integer NOT NULL,
	`cantidad` integer NOT NULL,
	`precioUnitario` real NOT NULL,
	`descuento` real DEFAULT 0,
	`subtotal` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `librosSAR` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fecha` integer NOT NULL,
	`numeroFactura` text NOT NULL,
	`clienteNombre` text NOT NULL,
	`clienteRTN` text,
	`exentas` real DEFAULT 0 NOT NULL,
	`gravadas15` real DEFAULT 0 NOT NULL,
	`isv15` real DEFAULT 0 NOT NULL,
	`total` real NOT NULL,
	`tipo` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movimientosConsumibles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consumibleId` integer NOT NULL,
	`tipo` text NOT NULL,
	`cantidad` real NOT NULL,
	`cantidadAnterior` real NOT NULL,
	`cantidadNueva` real NOT NULL,
	`motivo` text,
	`usuarioId` integer,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`consumibleId`) REFERENCES `consumibles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notasCredito` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ventaId` integer NOT NULL,
	`numeroNota` text NOT NULL,
	`motivo` text NOT NULL,
	`monto` real NOT NULL,
	`estado` text DEFAULT 'pendiente' NOT NULL,
	`aplicadaEn` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`ventaId`) REFERENCES `ventas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notasCredito_numeroNota_unique` ON `notasCredito` (`numeroNota`);--> statement-breakpoint
CREATE TABLE `pagosCredito` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ventaCreditoId` integer NOT NULL,
	`monto` real NOT NULL,
	`metodoPago` text NOT NULL,
	`referencia` text,
	`notas` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`ventaCreditoId`) REFERENCES `ventasCredito`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `productos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`precio` real NOT NULL,
	`costo` real,
	`stock` integer DEFAULT 0 NOT NULL,
	`stockMinimo` integer DEFAULT 0,
	`categoria` text,
	`proveedor` text,
	`imagen` text,
	`activo` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `productos_codigo_unique` ON `productos` (`codigo`);--> statement-breakpoint
CREATE TABLE `promociones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`tipo` text NOT NULL,
	`valor` real NOT NULL,
	`aplicaA` text NOT NULL,
	`productoId` integer,
	`clienteId` integer,
	`fechaInicio` integer NOT NULL,
	`fechaFin` integer NOT NULL,
	`activa` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`productoId`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sucursales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`direccion` text,
	`telefono` text,
	`rtn` text,
	`cai` text,
	`rangoInicio` text,
	`rangoFin` text,
	`fechaLimiteEmision` integer,
	`activo` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text,
	`nombre` text,
	`email` text,
	`password` text,
	`loginMethod` text,
	`rol` text DEFAULT 'vendedor' NOT NULL,
	`sucursalId` integer,
	`activo` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_openId_unique` ON `usuarios` (`openId`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);--> statement-breakpoint
CREATE TABLE `ventas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numeroFactura` text NOT NULL,
	`clienteId` integer,
	`usuarioId` integer NOT NULL,
	`sucursalId` integer NOT NULL,
	`subtotal` real NOT NULL,
	`descuento` real DEFAULT 0,
	`impuesto` real DEFAULT 0,
	`total` real NOT NULL,
	`metodoPago` text NOT NULL,
	`efectivo` real,
	`tarjeta` real,
	`transferencia` real,
	`cambio` real,
	`notas` text,
	`anulada` integer DEFAULT false,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ventas_numeroFactura_unique` ON `ventas` (`numeroFactura`);--> statement-breakpoint
CREATE TABLE `ventasCredito` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ventaId` integer NOT NULL,
	`clienteId` integer NOT NULL,
	`montoTotal` real NOT NULL,
	`montoPagado` real DEFAULT 0 NOT NULL,
	`saldo` real NOT NULL,
	`fechaVencimiento` integer NOT NULL,
	`estado` text DEFAULT 'pendiente' NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`ventaId`) REFERENCES `ventas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action
);
