CREATE TABLE "descuentosVolumen" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"tipo" varchar(50) DEFAULT 'cantidad' NOT NULL,
	"aplicarA" varchar(50) DEFAULT 'todos' NOT NULL,
	"productoId" integer,
	"categoriaId" integer,
	"cantidadMinima" integer,
	"montoMinimo" integer,
	"tipoDescuento" varchar(50) DEFAULT 'porcentaje' NOT NULL,
	"valorDescuento" integer NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"prioridad" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
