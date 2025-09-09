// 1. Importar o Express
const express = require("express");

// 2. Criar uma instância do Express
const app = express();

// 3. Definir a porta
const port = 3000;

// 4. Definir uma rota principal (GET para a raiz '/')
app.get("/", (req, res) => {
  res.send("Olá, Mundo com Express!");
});

// Rota para listar todos os usuários (exemplo)
app.get("/users", (req, res) => {
  res.send("Listando todos os usuários...");
});

// Rota para criar um novo usuário (exemplo)
app.post("/users", (req, res) => {
  res.send("Criando um novo usuário...");
});
//users/123, req.params.id será a string "123".

// Rota de busca com filtro
app.get("/search", (req, res) => {
  const searchTerm = req.query.q;
  res.send(`Você buscou por: ${searchTerm}`);
});

///search?q=nodejs, req.query.q será a string "nodejs

// Rota para buscar um usuário por ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`Buscando o usuário com ID: ${userId}`);
});

// 5. Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express rodando em <http://localhost:${port}`);
});
