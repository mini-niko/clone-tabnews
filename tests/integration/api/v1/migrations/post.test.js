import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response.status).toBe(201);

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});

test("POST to /api/v1/migrations again should return 201", async () => {
  const getResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST"
  });

  expect(getResponse.status).toBe(200);

  const getResponseBody = await getResponse.json();

  expect(Array.isArray(getResponseBody)).toBe(true);
  expect(getResponseBody.length).toBe(0);
});
