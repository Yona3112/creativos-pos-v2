CREATE TYPE "public"."estado_cotizacion" AS ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Convertida');--> statement-breakpoint
CREATE TYPE "public"."metodo_pago" AS ENUM('Efectivo', 'Tarjeta', 'Transferencia', 'Mixto');--> statement-breakpoint
CREATE TYPE "public"."nivel_cliente" AS ENUM('bronce', 'plata', 'oro', 'platino');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'vendedor', 'gerente');--> statement-breakpoint
CREATE TYPE "public"."tipo_nota_credito" AS ENUM('efectivo', 'credito');--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"color" varchar(7) DEFAULT '#3B82F6',
	"icono" varchar(50) DEFAULT 'fas fa-tag',
	"orden" integer DEFAULT 0,
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"email" varchar(320),
	"telefono" varchar(20),
	"direccion" text,
	"rtn" varchar(20),
	"puntos" integer DEFAULT 0,
	"nivel" "nivel_cliente" DEFAULT 'bronce',
	"totalCompras" integer DEFAULT 0,
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configuracion" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(100) NOT NULL,
	"valor" jsonb,
	"descripcion" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "configuracion_clave_unique" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "consumibles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"cantidad" integer,
	"unidad" varchar(50),
	"costo" integer,
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cortesCaja" (
	"id" serial PRIMARY KEY NOT NULL,
	"folio" varchar(50) NOT NULL,
	"fechaInicio" timestamp,
	"fechaFin" timestamp,
	"usuario" varchar(255),
	"sucursal" varchar(255),
	"efectivoInicial" integer,
	"efectivoFinal" integer,
	"ventasEfectivo" integer,
	"ventasTarjeta" integer,
	"totalVentas" integer,
	"diferencia" integer,
	"notas" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cortesCaja_folio_unique" UNIQUE("folio")
);
--> statement-breakpoint
CREATE TABLE "cotizaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"folio" varchar(50) NOT NULL,
	"fecha" timestamp DEFAULT now() NOT NULL,
	"fechaVencimiento" timestamp,
	"clienteId" integer,
	"clienteNombre" varchar(255) DEFAULT 'Cliente General',
	"clienteTelefono" varchar(20),
	"clienteEmail" varchar(320),
	"subtotal" integer NOT NULL,
	"descuento" integer DEFAULT 0,
	"impuestos" integer DEFAULT 0,
	"total" integer NOT NULL,
	"productos" jsonb NOT NULL,
	"notas" text,
	"estado" "estado_cotizacion" DEFAULT 'Pendiente',
	"vigenciaDias" integer DEFAULT 15,
	"usuario" varchar(255) DEFAULT 'Sistema',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cotizaciones_folio_unique" UNIQUE("folio")
);
--> statement-breakpoint
CREATE TABLE "notasCredito" (
	"id" serial PRIMARY KEY NOT NULL,
	"folio" varchar(50) NOT NULL,
	"ventaId" integer,
	"folioVenta" varchar(50),
	"motivo" text,
	"monto" integer,
	"tipo" "tipo_nota_credito" DEFAULT 'efectivo',
	"usuario" varchar(255),
	"fecha" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notasCredito_folio_unique" UNIQUE("folio")
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(100),
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"precio" integer DEFAULT 0 NOT NULL,
	"costo" integer DEFAULT 0,
	"stock" integer DEFAULT 0 NOT NULL,
	"stockMinimo" integer DEFAULT 5,
	"categoriaId" integer,
	"sucursalId" integer,
	"imagen" text,
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promociones" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"tipo" varchar(50),
	"valor" integer,
	"fechaInicio" timestamp,
	"fechaFin" timestamp,
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proveedores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"contacto" varchar(255),
	"telefono" varchar(20),
	"email" varchar(320),
	"direccion" text,
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "puntosLealtad" (
	"id" serial PRIMARY KEY NOT NULL,
	"clienteId" integer NOT NULL,
	"puntos" integer DEFAULT 0,
	"fecha" timestamp DEFAULT now() NOT NULL,
	"tipo" varchar(50),
	"descripcion" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sucursales" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"direccion" text,
	"telefono" varchar(20),
	"email" varchar(320),
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64),
	"nombre" varchar(255),
	"email" varchar(320),
	"password" varchar(255),
	"loginMethod" varchar(64),
	"rol" "role" DEFAULT 'vendedor' NOT NULL,
	"sucursalId" integer,
	"activo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp,
	CONSTRAINT "usuarios_openId_unique" UNIQUE("openId"),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "ventas" (
	"id" serial PRIMARY KEY NOT NULL,
	"folio" varchar(50) NOT NULL,
	"clienteId" integer,
	"clienteNombre" varchar(255) DEFAULT 'Cliente General',
	"subtotal" integer NOT NULL,
	"descuento" integer DEFAULT 0,
	"impuestos" integer DEFAULT 0,
	"total" integer NOT NULL,
	"metodoPago" "metodo_pago" DEFAULT 'Efectivo',
	"efectivoRecibido" integer,
	"cambio" integer DEFAULT 0,
	"productos" jsonb NOT NULL,
	"notas" text,
	"usuario" varchar(255) DEFAULT 'Sistema',
	"sucursal" varchar(255) DEFAULT 'Principal',
	"fecha" timestamp DEFAULT now() NOT NULL,
	"anulada" boolean DEFAULT false,
	"fechaAnulacion" timestamp,
	"motivoAnulacion" text,
	"usuarioAnulacion" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ventas_folio_unique" UNIQUE("folio")
);
