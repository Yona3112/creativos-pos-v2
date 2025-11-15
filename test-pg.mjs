import postgres from "postgres";

const sql = postgres("postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway");

try {
  const result = await sql`SELECT COUNT(*) as count FROM users`;
  console.log("✅ PostgreSQL connection successful!");
  console.log("Users count:", result[0].count);
} catch (error) {
  console.error("❌ PostgreSQL connection failed:", error.message);
}

await sql.end();
