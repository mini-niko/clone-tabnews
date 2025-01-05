const { exec } = require("node:child_process");
const { clear } = require("node:console");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      checkPostgres();
      return;
    }
    clearInterval(loading);
    process.stdout.write("\r");
    console.log("🟢 Postgres está aceitando conexões");
  }
}

process.stdout.write("🔴 Aguardando por Postgres");
checkPostgres();

const loading = (() => {
  const loadingArray = ["\\", "|", "/", "⎯"];
  let i = 0;

  return setInterval(() => {
    process.stdout.write(
      `\r🔴 Aguardando por Postgres... ${loadingArray[i++ % loadingArray.length]} `,
    );
  }, 100);
})();
