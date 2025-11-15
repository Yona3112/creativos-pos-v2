import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "./drizzle/schema.ts";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";

console.log("🔍 Probando con la misma configuración del servidor...\n");

try {
  const client = postgres(DATABASE_URL);
  const db = drizzle(client, { schema, logger: true });
  
  console.log("✅ Cliente y Drizzle inicializados");
  console.log("");
  
  const result = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, "braham.admin@creativos.com")).limit(1);
  
  console.log("✅ Query exitosa!");
  console.log("Usuario encontrado:", result[0]);
  
  await client.end();
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);
}
