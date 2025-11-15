import { eq, desc, and } from "drizzle-orm";
import { getDb } from "../db";
import { cortesCaja } from "../../drizzle/schema";

export async function abrirCaja(usuarioId: number, montoInicial: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Verificar si hay caja abierta
  const [cajaAbierta] = await db.select().from(cortesCaja)
    .where(and(eq(cortesCaja.usuarioId, usuarioId), eq(cortesCaja.estado, "abierto")));

  if (cajaAbierta) throw new Error("Ya existe una caja abierta");

  await db.insert(cortesCaja).values({
    usuarioId,
    fechaApertura: new Date(),
    montoInicial,
    estado: "abierto",
  });
  
  const [corte] = await db.select().from(cortesCaja).orderBy(desc(cortesCaja.id)).limit(1);
  return corte;
}

export async function cerrarCaja(id: number, montoReal: number, notas?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [corte] = await db.select().from(cortesCaja).where(eq(cortesCaja.id, id));
  if (!corte) throw new Error("Corte no encontrado");

  const diferencia = montoReal - corte.montoEsperado;

  await db.update(cortesCaja).set({
    fechaCierre: new Date(),
    montoReal,
    diferencia,
    estado: "cerrado",
    notas,
  }).where(eq(cortesCaja.id, id));

  return { ...corte, montoReal, diferencia };
}

export async function obtenerCajaActual(usuarioId: number) {
  const db = await getDb();
  if (!db) return null;

  const [caja] = await db.select().from(cortesCaja)
    .where(and(eq(cortesCaja.usuarioId, usuarioId), eq(cortesCaja.estado, "abierto")))
    .orderBy(desc(cortesCaja.id)).limit(1);

  return caja || null;
}

export async function listarCortes() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cortesCaja).orderBy(desc(cortesCaja.createdAt));
}
