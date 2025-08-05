// 1. Gerar categorias e pesos
const categorias = [];
const pesosCategorias = [];
const tipos = ['eletronico', 'roupa', 'livro', 'alimento', 'moveis'];
const numCategorias = 100;
const numProdutos = 200;
 
for (let i = 0; i < numCategorias; i++) {
  const tipo = tipos[i % tipos.length];
  const nome = `${tipo}${Math.floor(i / tipos.length) + 1}`;
  categorias.push(nome);
  pesosCategorias.push({ nome, peso: Math.random() * 5 + 1 }); // peso entre 1 e 6
}
 
// 2. Gerar produtos
const produtos = [];
for (let i = 0; i < numProdutos; i++) {
  const categoria = categorias[i % categorias.length];
  produtos.push({
    id: i,
    nome: `Produto ${i}`,
    categoria,
    valor: Math.floor(Math.random() * 1000)
  });
}
 
// 3. Cálculo ponderado (valor * peso) com FOR-FOR
console.time('for-for ponderado');
for (let i = 0; i < produtos.length; i++) {
  const prod = produtos[i];
  for (let j = 0; j < pesosCategorias.length; j++) {
    if (prod.categoria === pesosCategorias[j].nome) {
      const resultado = prod.valor * pesosCategorias[j].peso;
      // resultado ignorado
      break;
    }
  }
}
console.timeEnd('for-for ponderado');
 
console.time('reduce ponderado');
// 4. Cálculo ponderado com REDUCE + Mapa
const mapaPesos = pesosCategorias.reduce((acc, cat) => {
  acc[cat.nome] = cat.peso;
  return acc;
}, {});

 
produtos.reduce((_, prod) => {
  const peso = mapaPesos[prod.categoria];
  const resultado = prod.valor * peso;
  return _;
}, null);
console.timeEnd('reduce ponderado');