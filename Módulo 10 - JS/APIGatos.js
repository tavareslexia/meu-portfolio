
// A função fetch() retorna uma Promise que resolve para um objeto Response.
fetch('https://catfact.ninja/fact')
 .then(response => {
    // O primeiro.then lida com a resposta HTTP em si.
    // É uma boa prática verificar se a resposta foi bem-sucedida.
    if (!response.ok) {
      // Se a resposta não for um sucesso (status não na faixa 200-299),
      // lançamos nosso próprio erro. Isso fará com que a Promise seja rejeitada
      // e a execução pulará para o bloco.catch().
      throw new Error(`Erro de HTTP! Status: ${response.status}`);
    }
    // response.json() também é uma operação assíncrona que retorna uma Promise.
    // Esta Promise resolverá com o corpo da resposta analisado como JSON.
    return response.json();
  })
 .then(data => {
    // Este segundo.then recebe o resultado da Promise de response.json().
    console.log("Fato sobre gatos:", data.fact);
  })
 .catch(error => {
    // Um único bloco.catch() no final da cadeia pode lidar com vários tipos de erros:
    // - Erros de rede (ex: sem conexão com a internet).
    // - O erro que lançamos manualmente no primeiro.then().
    console.error("Falha ao buscar o fato sobre gatos:", error);
  });
