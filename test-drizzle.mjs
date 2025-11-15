import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { usuarios } from "./drizzle/schema.ts";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);
const db = drizzle(client);

console.log("🔍 Probando query con Drizzle ORM...");

try {
  const result = await db.select().from(usuarios).where(eq(usuarios.email, "braham.admin@creativos.com")).limit(1);
  
  if (result.length > 0) {
    console.log("✅ Usuario encontrado:");
    console.log(JSON.stringify(result[0], null, 2));
  } else {
    console.log("❌ Usuario no encontrado");
  }
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);
} finally {
  await client.end();
}
