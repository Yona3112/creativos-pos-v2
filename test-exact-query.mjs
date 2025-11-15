import postgres from "postgres";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);

console.log("🔍 Probando la query exacta que falla...\n");

try {
  // Esta es la query exacta que genera Drizzle según el error
  const query = `select "id", "openId", "nombre", "email", "password", "loginMethod", "rol", "sucursalId", "activo", "createdAt", "updatedAt", "lastSignedIn" from "usuarios" where "usuarios"."email" = $1 limit $2`;
  const params = ["braham.admin@creativos.com", 1];
  
  console.log("Query:", query);
  console.log("Params:", params);
  console.log("");
  
  const result = await client.unsafe(query, params);
  
  console.log("✅ Query exitosa!");
  console.log("Resultado:", result[0]);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Code:", error.code);
  console.error("Detail:", error.detail);
} finally {
  await client.end();
}
