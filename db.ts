
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }

  return value;
}

export const db = new Pool({
  host: getEnv("DB_HOST"),
  port: Number(getEnv("DB_PORT")),
  user: getEnv("DB_USER"),
  password: getEnv("DB_PASSWORD"),
  database: getEnv("DB_NAME"),
  max: 10, 
});

async function testConnection() {
  try {
    const result = await db.query("SELECT NOW()");

    console.log("✅ PostgreSQL connected");
    console.log(result.rows);
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
  }
}
testConnection();