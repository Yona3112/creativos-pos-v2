import postgres from "postgres";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);

console.log("🔍 Verificando columnas de la tabla usuarios...");

try {
  const result = await client`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'usuarios'
    ORDER BY ordinal_position
  `;
  
  console.log("\n📋 Columnas encontradas:");
  result.forEach(col => {
    console.log(`   - ${col.column_name} (${col.data_type})`);
  });
  
} catch (error) {
  console.error("❌ Error:", error.message);
} finally {
  await client.end();
}
