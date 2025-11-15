import postgres from "postgres";
import bcrypt from "bcryptjs";

const DATABASE_URL = "postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway";
const client = postgres(DATABASE_URL);

console.log("🗑️  Eliminando tablas existentes...");

try {
  // Eliminar todas las tablas en orden inverso de dependencias
  await client`DROP TABLE IF EXISTS puntos_lealtad CASCADE`;
  await client`DROP TABLE IF EXISTS notas_credito CASCADE`;
  await client`DROP TABLE IF EXISTS cortes_caja CASCADE`;
  await client`DROP TABLE IF EXISTS consumibles CASCADE`;
  await client`DROP TABLE IF EXISTS promociones CASCADE`;
  await client`DROP TABLE IF EXISTS proveedores CASCADE`;
  await client`DROP TABLE IF EXISTS configuracion CASCADE`;
  await client`DROP TABLE IF EXISTS cotizaciones CASCADE`;
  await client`DROP TABLE IF EXISTS ventas CASCADE`;
  await client`DROP TABLE IF EXISTS clientes CASCADE`;
  await client`DROP TABLE IF EXISTS productos CASCADE`;
  await client`DROP TABLE IF EXISTS categorias CASCADE`;
  await client`DROP TABLE IF EXISTS usuarios CASCADE`;
  await client`DROP TABLE IF EXISTS sucursales CASCADE`;
  
  // Eliminar enums
  await client`DROP TYPE IF EXISTS tipo_nota_credito CASCADE`;
  await client`DROP TYPE IF EXISTS metodo_pago CASCADE`;
  await client`DROP TYPE IF EXISTS nivel_cliente CASCADE`;
  await client`DROP TYPE IF EXISTS estado_cotizacion CASCADE`;
  await client`DROP TYPE IF EXISTS role CASCADE`;
  
  console.log("✅ Tablas eliminadas exitosamente");
  
} catch (error) {
  console.error("❌ Error al eliminar tablas:", error.message);
} finally {
  await client.end();
  console.log("✅ Script completado");
}
