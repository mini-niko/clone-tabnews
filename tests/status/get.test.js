test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const body = await response.json();

  const parsedDate = new Date(body.updated_at).toISOString();

  expect(body.updated_at).toEqual(parsedDate);

  const databaseInfo = body.dependecies.database;

  expect(databaseInfo.status).toBe("healthy");
  expect(databaseInfo.version).toBe("16.0");
  expect(databaseInfo.max_connections).toBe(100);
  expect(databaseInfo.open_connections).toBe(1);
});

test.only("Teste de SQL Injection", async () => {
  const response = await fetch(
    "http://localhost:3000/api/v1/status?database_name='; SELECT pg_sleep(4) ; --",
  );

  const body = await response.json();
  console.log(body);
});
