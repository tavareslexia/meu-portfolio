
const minhaPromessa = new Promise((resolve, reject) => {
  console.log("Iniciando a operação demorada...");
  
  setTimeout(() => {
    const sucesso = false; // Simule se a operação deu certo ou não

    if (sucesso) {
      resolve("Operação concluída com sucesso!"); // A promessa foi cumprida!
    } else {
      reject("Ocorreu um erro na operação."); // A promessa foi rejeitada!
    }
  }, 2000); // Simula uma espera de 2 segundos
});

minhaPromessa
  .then((mensagem) => {
    console.log("Sucesso:", mensagem);
  })
  .catch((erro) => {
    console.error("Erro:", erro);
  });
