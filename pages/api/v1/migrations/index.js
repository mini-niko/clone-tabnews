import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

async function migrations(req, res) {
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

  if (!toExecute) return res.status(405).end();
  else toExecute();
}

export default migrations;
