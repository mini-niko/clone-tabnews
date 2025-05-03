import database from "infra/database.js";
import createCustomRouter from "infra/router";

export default createCustomRouter({
  getHandler,
});

async function getHandler(req, res) {
  const updatedAt = new Date().toISOString();

  const queryVersion = await database.query(`SHOW server_version;`);
  const version = queryVersion.rows[0].server_version;

  const queryMaxConnections = await database.query("SHOW max_connections;");
  const maxConnections = queryMaxConnections.rows[0].max_connections;

  const queryOpenConnections = await database.query(
    `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    [process.env.POSTGRES_DB],
  );
  const openConnections = queryOpenConnections.rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        status: "healthy",
        max_connections: parseInt(maxConnections),
        open_connections: openConnections,
        version,
      },
    },
  });
}
