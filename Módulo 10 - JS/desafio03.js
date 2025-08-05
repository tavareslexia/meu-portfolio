function buscarTresAtividades() {
  const url = "https://bored-api.appbrewery.com/random";

  // Cria um array com 3 fetchs simultaneos
  const requisicoes = [
    fetch(url),
    fetch(url),
    fetch(url)
  ];

  // Espera todas as requisições serem concluidas
  Promise.all(requisicoes)
    .then((respostas) => {
      // Converte todas as respostas para JSON
      return Promise.all(respostas.map((res) => {
        if (!res.ok) {
          throw new Error("Uma das respostas falhou");
        }
        return res.json();
      }));
    })
    .then((dados) => {
      // Extrai e imprime apenas as atividades
      const atividades = dados.map((item) => item.activity);
      console.log("Atividades sugeridas:", atividades);
      // Extrai e imprime apenas os  tipos
      const tipo = dados.map((item) => item.type);
      console.log("Tipo de atividade:", tipo);
    })
    .catch((erro) => {
      console.error("Ocorreu um erro:", erro);
    });

}


buscarTresAtividades();