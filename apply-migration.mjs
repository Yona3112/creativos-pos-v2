import postgres from "postgres";
import fs from "fs";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);

console.log("📦 Aplicando migración SQL...");

try {
  // Leer el archivo SQL
  const sqlContent = fs.readFileSync("drizzle/0000_soft_prowler.sql", "utf-8");
  
  // Dividir por statement-breakpoint y ejecutar cada statement
  const statements = sqlContent
    .split("--> statement-breakpoint")
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  console.log(`📋 Ejecutando ${statements.length} statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await client.unsafe(stmt);
      console.log(`✅ Statement ${i + 1}/${statements.length} ejecutado`);
    } catch (error) {
      console.error(`❌ Error en statement ${i + 1}:`, error.message);
      console.error("Statement:", stmt.substring(0, 100));
    }
  }
  
  console.log("✅ Migración completada exitosamente");
  
} catch (error) {
  console.error("❌ Error al aplicar migración:", error.message);
} finally {
  await client.end();
}
