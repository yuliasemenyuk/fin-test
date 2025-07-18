import knex from 'knex';
import { dbConfig } from './config';

export const db = knex({
  client: 'mssql',
  connection: {
    server: dbConfig.server,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    options: {
      encrypt: dbConfig.options.encrypt,
      trustServerCertificate: dbConfig.options.trustServerCertificate
    }
  },
  migrations: {
    disableMigrationsListValidation: true
  }
}); 