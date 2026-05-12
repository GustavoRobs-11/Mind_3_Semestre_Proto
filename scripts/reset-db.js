/**
 * reset-db.js
 * Derruba o banco de dados MongoDB para permitir uma nova subida limpa.
 * O DataInitializer do backend vai recriar os dados de seed automaticamente
 * na próxima vez que o servidor subir.
 *
 * Uso: npm run reset:db
 *      npm run db:drop
 *      npm run reset:all
 */

const { MongoClient } = require('mongodb');
const { chromium } = require('playwright');

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'mindDB';
const FRONTEND_URL = 'http://localhost:3000';
const CLEAR_BROWSER_STORAGE = process.argv.includes('--clear-browser-storage');

async function resetDb() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB.');

    const db = client.db(DB_NAME);
    await db.dropDatabase();

    console.log(`Banco '${DB_NAME}' derrubado com sucesso.`);

    if (CLEAR_BROWSER_STORAGE) {
      await clearBrowserStorage();
    }

    console.log('\nReset concluído! Reinicie o backend para re-popular com os dados iniciais.');
  } catch (err) {
    console.error('Erro ao resetar o banco de dados:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

async function clearBrowserStorage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(FRONTEND_URL, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await context.clearCookies();
    console.log(`Storage do navegador limpo para ${FRONTEND_URL}.`);
  } catch (err) {
    console.warn(`Não foi possível limpar o storage em ${FRONTEND_URL}. Verifique se o frontend está rodando.`);
  } finally {
    await browser.close();
  }
}

resetDb();
