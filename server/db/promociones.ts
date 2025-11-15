import { desc } from "drizzle-orm";
import { eq, and, lte, gte } from "drizzle-orm";
import { getDb } from "../db";
import { promociones } from "../../drizzle/schema";

export async function crearPromocion(data: {
  nombre: string;
  descripcion?: string;
  tipo: "porcentaje" | "monto_fijo" | "2x1" | "3x2";
  valor: number;
  aplicaA: "producto" | "categoria" | "cliente" | "todos";
  productoId?: number;
  clienteId?: number;
  fechaInicio: Date;
  fechaFin: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(promociones).values(data);
  const [promocion] = await db.select().from(promociones).orderBy(desc(promociones.id)).limit(1);
  return promocion;
}

export async function listarPromocionesActivas() {
  const db = await getDb();
  if (!db) return [];

  const ahora = new Date();
  return db.select().from(promociones)
    .where(and(
      eq(promociones.activa, true),
      lte(promociones.fechaInicio, ahora),
      gte(promociones.fechaFin, ahora)
    ));
}

export async function obtenerPromocionesProducto(productoId: number) {
  const db = await getDb();
  if (!db) return [];

  const ahora = new Date();
  return db.select().from(promociones)
    .where(and(
      eq(promociones.activa, true),
      eq(promociones.productoId, productoId),
      lte(promociones.fechaInicio, ahora),
      gte(promociones.fechaFin, ahora)
    ));
}

export async function desactivarPromocion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(promociones).set({ activa: false }).where(eq(promociones.id, id));
  return true;
}
