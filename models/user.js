import database from "infra/database";
import password from "models/password.js";
import { NotFoundError, ValidationError } from "infra/errors";

async function create(userInputData) {
  await validateUniqueUsername(userInputData.username);
  await validateUniqueEmail(userInputData.email);
  await hashPasswordInObject(userInputData);

  const newUser = await runInsertQuery(userInputData);
  return newUser;

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

async function findOneByEmail(email) {
  const userFound = await runSelectQuery(email);

  return userFound;

  async function runSelectQuery(email) {
    const results = await database.query(
      `
      SELECT
        * 
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      LIMIT
        1
      ;`,
      [email],
    );

    if (results.rowCount === 0) {
      throw new NotFoundError({
        name: "NotFoundError",
        message: "O email informado não foi encontrador no sistema.",
        action: "Verifique se o email está digitado corretamente.",
        status_code: 404,
      });
    }

    return results.rows[0];
  }
}

async function update(username, userInputData) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputData) {
    await validateUniqueUsername(userInputData.username);
  }

  if ("email" in userInputData) {
    await validateUniqueEmail(userInputData.email);
  }

  if ("password" in userInputData) {
    await hashPasswordInObject(userInputData);
  }

  const userWithNewData = { ...currentUser, ...userInputData };

  const updatedUser = await runUpdateQuery(userWithNewData);
  return updatedUser;

  async function runUpdateQuery(userWithNewData) {
    const results = await database.query(
      `
      UPDATE
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *
      ;`,
      [
        userWithNewData.id,
        userWithNewData.username,
        userWithNewData.email,
        userWithNewData.password,
      ],
    );

    return results.rows[0];
  }
}

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
      action: "Utilize outro nome de usuário para realizar esta operação.",
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
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputData) {
  const hashedPassword = await password.hash(userInputData.password);
  userInputData.password = hashedPassword;
}

const user = { create, findOneByUsername, findOneByEmail, update };

export default user;
