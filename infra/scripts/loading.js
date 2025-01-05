function loadingFunc() {
  const loadingArray = ["\\", "|", "/", "⎯"];
  let i = 0;

  return setInterval(() => {
    process.stdout.write(
      `\r🔴 Aguardando por Postgres... ${loadingArray[i++ % loadingArray.length]} `,
    );
  }, 150);
}

module.exports = {
  loadingFunc,
};
