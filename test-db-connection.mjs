import postgres from "postgres";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";

console.log("🔌 Probando conexión a PostgreSQL de Railway...");
console.log("URL:", DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

const client = postgres(DATABASE_URL);

try {
  // Probar conexión
  const result = await client`SELECT version()`;
  console.log("✅ Conexión exitosa!");
  console.log("Versión de PostgreSQL:", result[0].version);
  
  // Listar tablas
  const tables = await client`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log("\n📋 Tablas encontradas:", tables.length);
  tables.forEach(t => console.log("  -", t.table_name));
  
  // Verificar si existe la tabla usuarios
  const usuariosExists = tables.some(t => t.table_name === 'usuarios');
  console.log("\n👤 Tabla 'usuarios' existe:", usuariosExists);
  
  if (usuariosExists) {
    const usuarios = await client`SELECT id, nombre, email, rol FROM usuarios LIMIT 5`;
    console.log("\n👥 Usuarios encontrados:", usuarios.length);
    usuarios.forEach(u => console.log("  -", u.email, `(${u.rol})`));
  }
  
} catch (error) {
  console.error("❌ Error:", error.message);
} finally {
  await client.end();
}
