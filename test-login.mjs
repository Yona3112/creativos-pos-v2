import postgres from "postgres";
import bcrypt from "bcryptjs";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);

console.log("🔍 Probando login...");

try {
  // Buscar usuario por email
  const result = await client`
    SELECT * FROM usuarios WHERE email = 'braham.admin@creativos.com'
  `;
  
  if (result.length === 0) {
    console.log("❌ Usuario no encontrado");
  } else {
    const usuario = result[0];
    console.log("✅ Usuario encontrado:");
    console.log("   ID:", usuario.id);
    console.log("   Email:", usuario.email);
    console.log("   Nombre:", usuario.nombre);
    console.log("   Rol:", usuario.rol);
    console.log("   Activo:", usuario.activo);
    console.log("   Password hash:", usuario.password?.substring(0, 20) + "...");
    
    // Verificar contraseña
    const isValid = await bcrypt.compare("admin123", usuario.password);
    console.log("   Contraseña válida:", isValid);
  }
  
} catch (error) {
  console.error("❌ Error:", error.message);
} finally {
  await client.end();
}
