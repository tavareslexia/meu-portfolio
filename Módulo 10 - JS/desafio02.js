async function buscarAtividadeAsync() { //define a funçao async
  try {
    const resposta = await fetch("https://bored-api.appbrewery.com/random"); //faz a requisição HTTP - Await: cod espera

    if (!resposta.ok) { //Verifica se a resposta foi bem sucedida
      throw new Error("Erro na resposta da rede");
    }

    const dados = await resposta.json(); //converte o corpo da resp para um objt - JSON retorna uma promise
    console.log("Atividade sugerida:", dados.activity); 
    console.log(dados.type);
  } catch (erro) {
    console.error("Ocorreu um erro:", erro);
  }
}
buscarAtividadeAsync();
console.log("ksksksk");