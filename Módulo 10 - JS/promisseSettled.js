
// Uma URL válida e uma URL que resultará em erro
const promiseValida = fetch('https://pokeapi.co/api/v2/pokemon/ditto'); // API de Pokémon
const promiseInvalida = fetch('https://pokeap.co/api/v2/pokemon/ditto'); // API de Pokémon com erro de digitação

console.log("Iniciando múltiplas buscas, uma delas deve falhar...");

Promise.allSettled([promiseValida, promiseInvalida])
 .then(results => {
    // Este.then sempre será executado, desde que não haja um erro catastrófico.
    // 'results' é um array de objetos de status.
    console.log("Todas as Promises foram resolvidas (cumpridas ou rejeitadas).");

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        // A Promise foi bem-sucedida. O valor está em 'result.value'.
        console.log(`Promise ${index + 1}: Cumprida com valor:`, result.value);
      } else {
        // A Promise falhou. O motivo está em 'result.reason'.
        console.error(`Promise ${index + 1}: Rejeitada com motivo:`, result.reason);
      }
    });

    // Podemos agora processar os resultados bem-sucedidos
    const successfulResults = results
     .filter(r => r.status === 'fulfilled')
     .map(r => r.value); // 'value' aqui é o objeto Response

    console.log("Resultados bem-sucedidos:", successfulResults);
  });
