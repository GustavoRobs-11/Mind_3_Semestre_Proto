/**
 * reset-db.js
 * Derruba o banco de dados MongoDB para permitir uma nova subida limpa.
 * O DataInitializer do backend vai recriar os dados de seed automaticamente
 * na próxima vez que o servidor subir.
 *
 * Uso: npm run reset:db
 *      npm run db:drop
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'mindDB';

async function resetDb() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB.');

    const db = client.db(DB_NAME);
    await db.dropDatabase();

    console.log(`Banco '${DB_NAME}' derrubado com sucesso.`);
    console.log('\nReset concluído! Reinicie o backend para re-popular com os dados iniciais.');
  } catch (err) {
    console.error('Erro ao resetar o banco de dados:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

resetDb();
