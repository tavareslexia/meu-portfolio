//  Ficha de personagem

const personagem = {
  nome: "Aragorn",
  classe: "Guerreiro",
  raca: "Humano",
  forca: 18,
  destreza: 15,
  inteligencia: 14,
};

const atributosPersonagem = Object.keys(personagem);

console.log("Atributos do personagem:");

for (const item of atributosPersonagem) {
  console.log(`- ${item}`);
}

const valoresAtributos = Object.values(personagem);

console.log("Valores dos atributos:");

for (const item of valoresAtributos) {
  console.log(`- ${item}`);
}

// Formataçaõ do preço

const precosEmCentavos = {
  café: 500,
  bolo: 850,
  suco: 425,
};

for (var i in precosEmCentavos) {
  precosEmCentavos[i] = "R$" + (precosEmCentavos[i] / 100).toFixed(2);
  console.log(i + "=" + precosEmCentavos[i]);
}

console.log(precosEmCentavos);

// Padronização das chaves
//text.replaceAll("_","");

const configDesordenada = {
  USER_ALEXIA_NAME: "admin",
  user_email: "admin@test.com",
  "Max_TEST-Connections": 10,
  enable_logging: true,
};

const configFormatada = {};

 function removerCaracter(chave, caracter) {
    let index = chave.indexOf(caracter);

    while (index > -1) {
      novaChave =
        novaChave.slice(0, index) +
        novaChave[index + 1].toUpperCase() +
        novaChave.slice(index + 2);
      index = novaChave.indexOf(caracter);
    }
    return novaChave;
  }

for (var i in configDesordenada) {
  let novaChave = i.toLowerCase();

  removerCaracter(novaChave, "-");
  removerCaracter(novaChave, "_");
  configFormatada[novaChave] = configDesordenada[i];
}
console.log(configFormatada);

// Relatorio de vendas

const carrinho = {
  itemA: { preco: 10, qtd: 2 },
  itemB: { preco: 5, qtd: 4 },
  itemC: { preco: 25, qtd: 3 },
};

const relatorioVendas = {};

for (var i in carrinho) {
  relatorioVendas[i] = carrinho[i].preco * carrinho[i].qtd;
}

console.log(relatorioVendas);
