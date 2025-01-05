const { exec } = require("node:child_process");
const { clear } = require("node:console");
const { loadingFunc } = require("./loading");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      checkPostgres();
      return;
    }
    clearInterval(loading);
    process.stdout.write("\r");
    console.log("🟢 Postgres está aceitando conexões\n");
  }
}

console.log("");
checkPostgres();

const loading = loadingFunc();
