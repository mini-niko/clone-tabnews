import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

async function migrations(req, res) {
  const acceptedMethods = ["GET", "POST"];

  if (!acceptedMethods.includes(req.method)) return res.status(405).end();

  const dbClient = await database.getNewClient();

  const migrationRunnerOptions = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const execute = {
    async GET() {
      const pendingMigrations = await migrationRunner({
        ...migrationRunnerOptions,
        dryRun: true,
      });

      res.status(200).json(pendingMigrations);
    },
    async POST() {
      const migratedMigrations = await migrationRunner({
        ...migrationRunnerOptions,
      });

      const method = migratedMigrations.length === 0 ? 200 : 201;

      res.status(method).json(migratedMigrations);
    },
  };

  const toExecute = execute[req.method];

  try {
    await toExecute();
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await dbClient.end();
  }
}

export default migrations;
