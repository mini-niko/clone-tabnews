import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject, params = []) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject, params);
    return result;
  } catch (err) {
    const serviceErrorObj = new ServiceError({
      message: "Erro na conexão com o Postgres ou na query.",
      cause: err,
    });
    throw serviceErrorObj;
  } finally {
    await client?.end();
  }
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV != "production" ? false : true;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
