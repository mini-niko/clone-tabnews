import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase;
});

describe("POST /api/v1/migrations", () => {
  describe("Annonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(201);

        const body = await response.json();

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const getResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(getResponse.status).toBe(200);

        const getResponseBody = await getResponse.json();

        expect(Array.isArray(getResponseBody)).toBe(true);
        expect(getResponseBody.length).toBe(0);
      });
    });
  });
});
