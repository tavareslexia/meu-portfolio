  
// function buscarUsuarioLegacy(id, callbackSucesso, callbackErro) {
//   console.log(`Iniciando a busca pelo usuário com ID: ${id}...`);

//   // Simula a latência da rede com setTimeout
//   setTimeout(() => {
//     // Lógica para simular sucesso ou falha
//     const sucesso = Math.random() > 0.5; // 50% de chance de sucesso

//     if (sucesso) {
//       const data = {
//         id: id,
//         nome: `Usuário ${id}`,
//         email: `usuario${id}@exemplo.com`,
//       };
      
//       const status = "Sucesso";
//       // É invocada a primeira callback em caso de sucesso
//       callbackSucesso(data, status);
//     } else {
//       const error = {
//         message: `Erro ao buscar o usuário ${id}. Tente novamente.`
//       };
//       // É invocada a segunda callback em caso de falha
//       callbackErro(error);
//     }
//   }, 2000); // Simula 2 segundos de espera
// }

buscarUsuario(id)
  .then(({ data, status }) => {
    console.log(` ${status}:`, data);
  })
  .catch((erro) => {
    console.error(`Erro: ${erro.message}`);
  });

  buscarUsuario();