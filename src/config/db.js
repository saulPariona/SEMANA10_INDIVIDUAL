import 'dotenv/config';
import mysql from 'mysql2/promise';

const requiredEnvironment = ['DB_HOST', 'DB_USER', 'DB_NAME'];

for (const variable of requiredEnvironment) {
  if (!process.env[variable]) {
    throw new Error(`Falta la variable de entorno obligatoria: ${variable}`);
  }
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0
});

export async function checkDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}
