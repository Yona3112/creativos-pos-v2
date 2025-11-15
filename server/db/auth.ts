import { eq } from "drizzle-orm";
import { InsertUsuario, usuarios, Usuario } from "../../drizzle/schema";
import { getDb } from "../db";
import { hashPassword } from "../utils/auth";

/**
 * Crear un nuevo usuario
 */
export async function createUsuario(data: {
  nombre: string;
  email: string;
  password: string;
  rol?: "admin" | "vendedor" | "gerente";
  sucursalId?: number;
}): Promise<Usuario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Hash de la contraseña
  const hashedPassword = await hashPassword(data.password);

  await db
    .insert(usuarios)
    .values({
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
      rol: data.rol || "vendedor",
      sucursalId: data.sucursalId,
      activo: true,
    });

  const [result] = await db.select().from(usuarios).orderBy(desc(usuarios.id)).limit(1);
  return result;
}

/**
 * Obtener usuario por email
 */
export async function getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available. POSTGRES_URL:", process.env.POSTGRES_URL ? "SET" : "NOT SET");
    throw new Error("Database not available");
  }

  const result = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
  return result;
}

/**
 * Obtener usuario por ID
 */
export async function getUsuarioById(id: number): Promise<Usuario | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  return result;
}

/**
 * Obtener todos los usuarios activos
 */
export async function getAllUsuarios(): Promise<Usuario[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(usuarios).where(eq(usuarios.activo, true));
}

/**
 * Actualizar usuario
 */
export async function updateUsuario(id: number, data: Partial<InsertUsuario>): Promise<Usuario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Si se actualiza la contraseña, hashearla
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  await db
    .update(usuarios)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(usuarios.id, id));

  const [result] = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  
  if (!result) {
    throw new Error(`Usuario con ID ${id} no encontrado`);
  }

  return result;
}

/**
 * Eliminar usuario (soft delete)
 */
export async function deleteUsuario(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(usuarios)
    .set({ activo: false, updatedAt: new Date() })
    .where(eq(usuarios.id, id));
    const result = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
}
