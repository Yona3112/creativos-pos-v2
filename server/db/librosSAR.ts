import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "../db";
import { librosSAR } from "../../drizzle/schema";

export async function registrarVentaSAR(data: {
  fecha: Date;
  numeroFactura: string;
  clienteNombre: string;
  clienteRTN?: string;
  exentas: number;
  gravadas15: number;
  isv15: number;
  total: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(librosSAR).values({
    ...data,
    tipo: "venta",
  });

  return true;
}

export async function obtenerLibroVentas(fechaInicio: Date, fechaFin: Date) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(librosSAR)
    .where(and(
      eq(librosSAR.tipo, "venta"),
      gte(librosSAR.fecha, fechaInicio),
      lte(librosSAR.fecha, fechaFin)
    ));
}
