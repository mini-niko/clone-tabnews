import createCustomRouter from "infra/router";
import migrator from "infra/migrator";

export default createCustomRouter({
  getHandler,
  postHandler,
});

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();

  res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const migratedMigrations = await migrator.runPendingMigrations();

  const status = migratedMigrations.length === 0 ? 200 : 201;

  res.status(status).json(migratedMigrations);
}
