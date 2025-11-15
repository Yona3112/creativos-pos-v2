import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import { ventasCredito, pagosCredito } from "../../drizzle/schema";

export async function crearVentaCredito(data: {
  ventaId: number;
  clienteId: number;
  montoTotal: number;
  fechaVencimiento: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(ventasCredito).values({
    ...data,
    saldo: data.montoTotal,
  });
  const [credito] = await db.select().from(ventasCredito).orderBy(desc(ventasCredito.id)).limit(1);

  return credito;
}

export async function registrarPago(ventaCreditoId: number, data: {
  monto: number;
  metodoPago: string;
  referencia?: string;
  notas?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [credito] = await db.select().from(ventasCredito).where(eq(ventasCredito.id, ventaCreditoId));
  if (!credito) throw new Error("Crédito no encontrado");

  await db.insert(pagosCredito).values({
    ventaCreditoId,
    ...data,
  });

  const nuevoMontoPagado = credito.montoPagado + data.monto;
  const nuevoSaldo = credito.montoTotal - nuevoMontoPagado;
  const nuevoEstado = nuevoSaldo <= 0 ? "pagado" : "pendiente";

  await db.update(ventasCredito).set({
    montoPagado: nuevoMontoPagado,
    saldo: nuevoSaldo,
    estado: nuevoEstado,
  }).where(eq(ventasCredito.id, ventaCreditoId));

  return true;
}

export async function listarCreditosPendientes() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(ventasCredito).where(eq(ventasCredito.estado, "pendiente")).orderBy(desc(ventasCredito.createdAt));
}

export async function obtenerCredito(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [credito] = await db.select().from(ventasCredito).where(eq(ventasCredito.id, id));
  if (!credito) return null;

  const pagos = await db.select().from(pagosCredito).where(eq(pagosCredito.ventaCreditoId, id));

  return { ...credito, pagos };
}
