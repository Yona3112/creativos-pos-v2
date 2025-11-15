import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { consumibles, movimientosConsumibles } from "../../drizzle/schema";

export async function crearConsumible(data: {
  productoId: number;
  unidadMedida: string;
  cantidadPorUnidad: number;
  stockActual: number;
  stockMinimo?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(consumibles).values(data);
  const [consumible] = await db.select().from(consumibles).orderBy(desc(consumibles.id)).limit(1);
  return consumible;
}

export async function registrarMovimiento(consumibleId: number, data: {
  tipo: "entrada" | "salida" | "ajuste";
  cantidad: number;
  motivo?: string;
  usuarioId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [consumible] = await db.select().from(consumibles).where(eq(consumibles.id, consumibleId));
  if (!consumible) throw new Error("Consumible no encontrado");

  const cantidadNueva = data.tipo === "entrada" 
    ? consumible.stockActual + data.cantidad
    : consumible.stockActual - data.cantidad;

  await db.insert(movimientosConsumibles).values({
    consumibleId,
    ...data,
    cantidadAnterior: consumible.stockActual,
    cantidadNueva,
  });

  await db.update(consumibles).set({
    stockActual: cantidadNueva,
    ultimaRecarga: data.tipo === "entrada" ? new Date() : consumible.ultimaRecarga,
  }).where(eq(consumibles.id, consumibleId));

  return true;
}

export async function listarConsumibles() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(consumibles);
}
