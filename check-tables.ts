import Database from "better-sqlite3";

const db = new Database("./data/pos.db");
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tablas existentes:", tables);
