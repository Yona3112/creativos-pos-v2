import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL no está configurada");
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function createAdminUser() {
  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insertar usuario admin
    await db.execute(`
      INSERT INTO usuarios (nombre, email, password, rol, activo, "createdAt", "updatedAt")
      VALUES ('Administrador', 'admin@creativos.com', '${hashedPassword}', 'admin', true, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `);

    console.log("✅ Usuario administrador creado exitosamente");
    console.log("Email: admin@creativos.com");
    console.log("Contraseña: admin123");
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
  } finally {
    await client.end();
  }
}

createAdminUser();
