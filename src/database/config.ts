import dotenv from 'dotenv';
import { ConnectionPool } from 'mssql';

dotenv.config();

export const dbConfig = {
  server: process.env.DB_SERVER!,
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.TRUST_SERVER_CERTIFICATE === 'true'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool: ConnectionPool | undefined;

export const getDbPool = async (): Promise<ConnectionPool> => {
  if (!pool) {
    pool = new ConnectionPool(dbConfig);
    await pool.connect();
    console.log('Connected to MSSQL database');
  }
  return pool;
};

export const closeDbPool = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = undefined;
    console.log('MSSQL database connection closed');
  }
}; 