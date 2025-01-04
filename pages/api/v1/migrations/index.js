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

      await dbClient.end();

      res.status(200).json(pendingMigrations);
    },
    async POST() {
      const migratedMigrations = await migrationRunner({
        ...migrationRunnerOptions,
      });
      await dbClient.end();

      const method = migratedMigrations.length === 0 ? 200 : 201;

      res.status(method).json(migratedMigrations);
    },
  };

  const toExecute = execute[req.method];
  toExecute();
}

export default migrations;
