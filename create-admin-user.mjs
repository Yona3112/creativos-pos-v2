import postgres from "postgres";
import bcrypt from "bcryptjs";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);

console.log("👤 Creando usuario administrador...");

try {
  // Hash de la contraseña
  const passwordHash = await bcrypt.hash("admin123", 10);
  
  // Insertar usuario admin
  const result = await client`
    INSERT INTO usuarios (
      nombre,
      email,
      password,
      "loginMethod",
      rol,
      activo,
      "createdAt",
      "updatedAt",
      "lastSignedIn"
    ) VALUES (
      'Braham Mejía',
      'braham.admin@creativos.com',
      ${passwordHash},
      'local',
      'admin',
      true,
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT (email) 
    DO UPDATE SET
      password = ${passwordHash},
      rol = 'admin',
      activo = true,
      "updatedAt" = NOW()
    RETURNING id, email, nombre, rol
  `;
  
  console.log("✅ Usuario administrador creado/actualizado:");
  console.log("   Email:", result[0].email);
  console.log("   Nombre:", result[0].nombre);
  console.log("   Rol:", result[0].rol);
  console.log("   ID:", result[0].id);
  console.log("");
  console.log("🔑 Credenciales de acceso:");
  console.log("   Email: braham.admin@creativos.com");
  console.log("   Contraseña: admin123");
  
} catch (error) {
  console.error("❌ Error al crear usuario:", error.message);
} finally {
  await client.end();
}
