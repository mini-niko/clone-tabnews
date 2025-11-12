import email from "infra/email.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.deleteAllEmails();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    const firstEmailObject = {
      from: "MiniCoffee <contato@minicoffee.com.br>",
      to: "contato@curso.dev",
      subject: "Primeiro email",
      text: "Corpo teste.\nOlha que legal!",
    };

    await email.send(firstEmailObject);

    const lastEmailObject = {
      from: "MiniCoffee <contato@minicoffee.com.br>",
      to: "contato@curso.dev",
      subject: "Último email",
      text: "Corpo teste.\r\nEste é o último email!",
    };

    await email.send(lastEmailObject);

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe(lastEmailObject.from.split(" ")[1]);
    expect(lastEmail.recipients[0]).toBe(`<${lastEmailObject.to}>`);
    expect(lastEmail.subject).toBe(lastEmailObject.subject);
    expect(lastEmail.text).toBe(`${lastEmailObject.text}\r\n`);
  });
});
