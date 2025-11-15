import Database from "better-sqlite3";

const db = new Database("./data/pos.db");

try {
  // Verificar si la columna ya existe
  const columns = db.prepare("PRAGMA table_info(configuracion)").all();
  const hasColumn = columns.some(col => col.name === "nombreTienda");
  
  if (!hasColumn) {
    db.exec("ALTER TABLE configuracion ADD COLUMN nombreTienda TEXT NOT NULL DEFAULT 'Creativos Gift Shop POS v2.0'");
    console.log("✅ Columna nombreTienda agregada exitosamente");
  } else {
    console.log("✅ Columna nombreTienda ya existe");
  }
} catch (error) {
  console.error("Error:", error.message);
}

db.close();
