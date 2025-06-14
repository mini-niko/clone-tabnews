import database from "infra/database.js";
import crypto from "node:crypto";

const EXPIRATION_IN_MILISSECONDS = 1000 * 60 * 60 * 24 * 30; //30 Dias

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILISSECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query(
      `
      INSERT INTO
        sessions (token, user_id, expires_at)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      [token, userId, expiresAt],
    );

    return results.rows[0];
  }
}

const session = {
  create,
  EXPIRATION_IN_MILISSECONDS,
};

export default session;
