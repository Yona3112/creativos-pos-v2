import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
const client = postgres(DATABASE_URL);

async function checkUser() {
  try {
    const result = await client`SELECT id, nombre, email, rol FROM usuarios WHERE email = 'admin@creativos.com'`;
    console.log("Usuario encontrado:", result);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

checkUser();
