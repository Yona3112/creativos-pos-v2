import postgres from "postgres";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);

console.log("🔍 Verificando nombres de columnas con case-sensitivity...\n");

try {
  // Probar query con comillas dobles (case-sensitive)
  console.log("1️⃣ Probando con comillas dobles (case-sensitive):");
  try {
    const result1 = await client`SELECT "id", "email" FROM "usuarios" LIMIT 1`;
    console.log("   ✅ Funciona con comillas dobles");
    console.log("   Resultado:", result1[0]);
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  
  // Probar query sin comillas (case-insensitive, lowercase)
  console.log("\n2️⃣ Probando sin comillas (case-insensitive):");
  try {
    const result2 = await client`SELECT id, email FROM usuarios LIMIT 1`;
    console.log("   ✅ Funciona sin comillas");
    console.log("   Resultado:", result2[0]);
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  
} catch (error) {
  console.error("❌ Error general:", error.message);
} finally {
  await client.end();
}
