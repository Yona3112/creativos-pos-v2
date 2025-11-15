import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import { notasCredito, detallesNotaCredito, ventas, productos } from "../../drizzle/schema";

export async function crearNotaCredito(data: {
  ventaId: number;
  motivo: string;
  detalles: Array<{ productoId: number; cantidad: number; precioUnitario: number }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Generar número de nota
  const ultimaNota = await db.select().from(notasCredito).orderBy(desc(notasCredito.id)).limit(1);
  const numeroNota = `NC-${String((ultimaNota[0]?.id || 0) + 1).padStart(6, "0")}`;

  // Calcular monto total
  const monto = data.detalles.reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0);

  // Crear nota de crédito
  await db.insert(notasCredito).values({
    ventaId: data.ventaId,
    numeroNota,
    motivo: data.motivo,
    monto,
    estado: "pendiente",
  });
  const [nota] = await db.select().from(notasCredito).orderBy(desc(notasCredito.id)).limit(1);

  // Crear detalles
  for (const detalle of data.detalles) {
    await db.insert(detallesNotaCredito).values({
      notaCreditoId: nota.id,
      productoId: detalle.productoId,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
      subtotal: detalle.cantidad * detalle.precioUnitario,
    });

    // Revertir stock
    const [producto] = await db.select().from(productos).where(eq(productos.id, detalle.productoId));
    if (producto) {
      await db.update(productos)
        .set({ stock: producto.stock + detalle.cantidad })
        .where(eq(productos.id, detalle.productoId));
    }
  }

  return nota;
}

export async function listarNotasCredito() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(notasCredito).orderBy(desc(notasCredito.createdAt));
}

export async function obtenerNotaCredito(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [nota] = await db.select().from(notasCredito).where(eq(notasCredito.id, id));
  if (!nota) return null;

  const detalles = await db.select().from(detallesNotaCredito).where(eq(detallesNotaCredito.notaCreditoId, id));

  return { ...nota, detalles };
}

export async function aplicarNotaCredito(id: number, ventaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notasCredito)
    .set({ estado: "aplicada", aplicadaEn: ventaId })
    .where(eq(notasCredito.id, id));

  return true;
}
