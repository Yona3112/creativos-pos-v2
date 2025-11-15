import Database from 'better-sqlite3';

const db = new Database('./data/pos.db');

const productos = [
  { codigo: 'PROD001', nombre: 'Taza Personalizada', categoria: 'Regalos', costo: 50, precio: 80, stock: 25, stockMinimo: 5, activo: 1 },
  { codigo: 'PROD002', nombre: 'Llavero Metálico', categoria: 'Accesorios', costo: 15, precio: 30, stock: 50, stockMinimo: 10, activo: 1 },
  { codigo: 'PROD003', nombre: 'Agenda 2025', categoria: 'Papelería', costo: 40, precio: 70, stock: 15, stockMinimo: 5, activo: 1 },
  { codigo: 'PROD004', nombre: 'Bolígrafo Premium', categoria: 'Papelería', costo: 20, precio: 35, stock: 100, stockMinimo: 20, activo: 1 },
  { codigo: 'PROD005', nombre: 'Termo Térmico', categoria: 'Regalos', costo: 80, precio: 150, stock: 10, stockMinimo: 3, activo: 1 },
  { codigo: 'PROD006', nombre: 'Cuaderno A4', categoria: 'Papelería', costo: 25, precio: 45, stock: 30, stockMinimo: 10, activo: 1 },
  { codigo: 'PROD007', nombre: 'Peluche Oso', categoria: 'Juguetes', costo: 60, precio: 120, stock: 8, stockMinimo: 5, activo: 1 },
  { codigo: 'PROD008', nombre: 'Marco de Fotos', categoria: 'Decoración', costo: 35, precio: 65, stock: 20, stockMinimo: 5, activo: 1 },
];

const insert = db.prepare(`
  INSERT INTO productos (codigo, nombre, categoria, costo, precio, stock, stockMinimo, activo, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

for (const p of productos) {
  try {
    insert.run(p.codigo, p.nombre, p.categoria, p.costo, p.precio, p.stock, p.stockMinimo, p.activo);
    console.log(`✓ ${p.nombre}`);
  } catch (e) {
    console.log(`✗ ${p.nombre} (ya existe)`);
  }
}

db.close();
console.log('\n✅ Productos de prueba agregados');
