import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import createCustomRouter from "infra/router";

export default createCustomRouter({
  getHandler,
  postHandler,
});

const migrationRunnerOptions = {
  dir: resolve(process.cwd(), "infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(req, res) {
  const dbClient = await database.getNewClient();

  const pendingMigrations = await migrationRunner({
    ...migrationRunnerOptions,
    dbClient,
    dryRun: true,
  });

  await dbClient.end();

  res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const dbClient = await database.getNewClient();

  const migratedMigrations = await migrationRunner({
    ...migrationRunnerOptions,
    dbClient,
  });

  await dbClient.end();

  const method = migratedMigrations.length === 0 ? 200 : 201;

  res.status(method).json(migratedMigrations);
}
