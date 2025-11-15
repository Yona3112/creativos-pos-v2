import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import { usuarios } from "../../drizzle/schema";

export async function crearUsuario(data: {
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "gerente" | "vendedor";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(usuarios).values(data);
  const [usuario] = await db.select().from(usuarios).orderBy(desc(usuarios.id)).limit(1);
  return usuario;
}

export async function actualizarUsuario(id: number, data: Partial<{
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "gerente" | "vendedor";
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(usuarios).set(data).where(eq(usuarios.id, id));
  return true;
}

export async function eliminarUsuario(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(usuarios).where(eq(usuarios.id, id));
  return true;
}

export async function listarUsuarios() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(usuarios);
}

export async function obtenerUsuario(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id));
  return usuario || null;
}
