import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { configuracion } from "../../drizzle/schema";

export async function obtenerConfiguracion() {
  const db = await getDb();
  if (!db) return null;

  const [config] = await db.select().from(configuracion).limit(1);
  return config || null;
}

export async function actualizarConfiguracion(data: Partial<{
  nombreEmpresa: string;
  rtn: string;
  telefono: string;
  email: string;
  direccion: string;
  moneda: string;
  simboloMoneda: string;
  tasaImpuesto: number;
  nombreImpuesto: string;
  cai: string;
  rangoInicio: string;
  rangoFin: string;
  fechaLimiteEmision: Date;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [config] = await db.select().from(configuracion).limit(1);

  if (config) {
    await db.update(configuracion).set({ ...data, updatedAt: new Date() }).where(eq(configuracion.id, config.id));
  } else {
    await db.insert(configuracion).values(data as any);
  }

  return true;
}
