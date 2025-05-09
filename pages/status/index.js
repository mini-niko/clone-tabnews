import useSWR from "swr";

async function fetchAPI() {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <p>Última atualização: {updatedAtText}</p>
      <div>
        <h3>Banco de dados:</h3>
        <p>
          Status: {data.dependecies.database.status}
          <br />
          Versão: {data.dependecies.database.version}
          <br />
          Quantidade de conexões máximas:{" "}
          {data.dependecies.database.max_connections}
          <br />
          Quantidade de conexões abertas:{" "}
          {data.dependecies.database.open_connections}
        </p>
      </div>
    </>
  );
}
