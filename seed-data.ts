import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./drizzle/schema-sqlite";
import * as bcrypt from "bcryptjs";

const sqlite = new Database("./data/pos.db");
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("🌱 Agregando datos de prueba...");

  // Agregar algunos clientes
  const clientes = [
    { nombre: "María González", email: "maria@example.com", telefono: "9999-8888", direccion: "Col. Centro", nivel: "vip" as const, limiteCredito: 5000 },
    { nombre: "Carlos Martínez", email: "carlos@example.com", telefono: "9999-7777", direccion: "Col. Las Palmas", nivel: "regular" as const, limiteCredito: 2000 },
    { nombre: "Ana López", email: "ana@example.com", telefono: "9999-6666", direccion: "Col. Kennedy", nivel: "nuevo" as const, limiteCredito: 1000 },
  ];

  for (const cliente of clientes) {
    await db.insert(schema.clientes).values(cliente);
  }
  console.log("✅ 3 clientes agregados");

  // Agregar más productos
  const productos = [
    { nombre: "Taza Personalizada", descripcion: "Taza cerámica con foto", precio: 150, costo: 80, stock: 25, codigoBarras: "7501234567890" },
    { nombre: "Llavero Acrílico", descripcion: "Llavero con diseño personalizado", precio: 45, costo: 20, stock: 50, codigoBarras: "7501234567891" },
    { nombre: "Camiseta Sublimada", descripcion: "Camiseta 100% algodón", precio: 250, costo: 120, stock: 15, codigoBarras: "7501234567892" },
    { nombre: "Gorra Bordada", descripcion: "Gorra ajustable con logo", precio: 180, costo: 90, stock: 20, codigoBarras: "7501234567893" },
    { nombre: "Termo Personalizado", descripcion: "Termo acero inoxidable 500ml", precio: 320, costo: 180, stock: 10, codigoBarras: "7501234567894" },
  ];

  for (const producto of productos) {
    await db.insert(schema.productos).values(producto);
  }
  console.log("✅ 5 productos nuevos agregados");

  // Agregar un usuario adicional
  const hashedPassword = await bcrypt.hash("vendedor123", 10);
  await db.insert(schema.usuarios).values({
    nombre: "Juan Vendedor",
    email: "juan.vendedor@creativos.com",
    password: hashedPassword,
    rol: "vendedor"
  });
  console.log("✅ 1 usuario vendedor agregado (juan.vendedor@creativos.com / vendedor123)");

  // Agregar configuración inicial
  await db.insert(schema.configuracion).values({
    nombreEmpresa: "Creativos Gift Shop",
    rtn: "08011999123456",
    telefono: "2222-3333",
    email: "info@creativos.hn",
    direccion: "Tegucigalpa, Honduras",
    tasaImpuesto: 0.15,
    moneda: "HNL"
  });
  console.log("✅ Configuración inicial agregada");

  console.log("\n🎉 Datos de prueba agregados exitosamente!");
}

seed().catch(console.error);
