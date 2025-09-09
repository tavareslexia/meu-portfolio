// 1. Importar o Express
const express = require("express");

// 2. Criar uma instância do Express
const app = express();

// 3. Definir a porta
const port = 3000;

const produtos = [];

// 4. Definir uma rota principal (GET para a raiz '/')
app.get("/", (req, res) => {
  res.send("Olá, Mundo com Express!");
});

// Rota para retornar data e hora
app.get("/date", (req, res) => {
  const now = new Date().toString();
  res.send(`Data e hora atual: ${now}\n`);
});

// Rota para adicionar produto
app.post("/produto", (req, res) => {
  const searchTerm = req.query.nome;

  if (produtos.includes(searchTerm)) {
    res.send(`Produto "${searchTerm}" já cadastrado.\n`);
  } else {
    produtos.push(searchTerm);
    res.send(`Produto "${searchTerm}" adicionado com sucesso!\n`);
  }
});

// Rota para visualizar produtos existentes
app.get("/view-produtos", (req, res) => {
  res.send(produtos);
});

// 5. Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express rodando em <http://localhost:${port}`);
});
