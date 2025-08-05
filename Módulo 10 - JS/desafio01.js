function buscarAtividadeThen() {
  fetch("https://bored-api.appbrewery.com/random")
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro de HTTP! Status: ${resposta.status}`);
      }

      return resposta.json();
    })
    .then(data => {

      console.log("Atividade sugerida:", data.activity);
    })
    .catch(error => {

      console.error("Ocorreu um erro:", error);
    });
}
buscarAtividadeThen();
console.log("mensagem");