import postgres from "postgres";
const sql = postgres("postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway");
try {
  const result = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  console.log("📋 Tables in PostgreSQL:");
  result.forEach(row => console.log("  -", row.tablename));
} catch (error) {
  console.error("Error:", error.message);
}
await sql.end();
