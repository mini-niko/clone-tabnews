import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

async function create(userInputData) {
  await validateUniqueUsername(userInputData.username);
  await validateUniqueEmail(userInputData.email);

  const newUser = await runInsertQuery(userInputData);
  return newUser;

  async function validateUniqueUsername(username) {
    const results = await database.query(
      `
      SELECT
        username 
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
      [username],
    );

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O nome de usuário informado já está sendo utilizado.",
        action: "Utilize outro nome de usuário para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const results = await database.query(
      `
      SELECT
        email 
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
      [email],
    );

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuery(userInputData) {
    const result = await database.query(
      `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ( $1, $2, $3 )
      RETURNING
        *
      ;`,
      [userInputData.username, userInputData.email, userInputData.password],
    );

    return result.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query(
      `
      SELECT
        * 
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,
      [username],
    );

    if (results.rowCount === 0) {
      throw new NotFoundError({
        name: "NotFoundError",
        message: "O username informado não foi encontrador no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    }

    return results.rows[0];
  }
}

export default { create, findOneByUsername };
