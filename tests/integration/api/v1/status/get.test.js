import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Annonymous user", () => {
    test("Retrieving current system status", async () => {
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
  });
});
