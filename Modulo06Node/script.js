const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
const port = 3000;

let produtos = [];
let idCounter = 0;

app.use(express.static(path.join(__dirname))); //pega config do file CSS

// Middleware de logging
const logMiddleware = (req, res, next) => {
  console.log(` ${req.method} ${req.url}`);
  next(); // Passa para o próximo middleware ou rota
};

// Aplicando o middleware a todas as requisições
app.use(logMiddleware);

// Rota inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota para adicionar produto
app.post("/produtos", (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res.status(400).send("Nome e preço são obrigatórios.");
  }

  const jaExiste = produtos.some(
    (p) => p.nome.trim().toLowerCase() === nome.trim().toLowerCase()
  );

  if (jaExiste) {
    console.log(`Produto "${nome}" já cadastrado.\n`);
    return res.send(`Produto "${nome}" já cadastrado.\n`);
  }
  const novoProduto = { id: idCounter++, nome, preco };
  produtos.push(novoProduto);
  console.log(`Produto "${nome}" cadastrado.\n`);
  return res.send(`Produto "${nome}" cadastrado com sucesso!`);
});

// Rota para visualizar produtos existentes
app.get("/view-produtos", (req, res) => {
  res.send(produtos);
});

// Rota para visualizar um produto individualmente
app.get("/produtos/:id", (req, res) => {
  const produto = produtos.find((p) => p.id == req.params.id);
  if (!produto) return res.send("Produto não encontrado");
  res.send(produto);
});

//Rota para atualizar um produto

app.patch("/produtos/:id", (req, res) => {
  const produto = produtos.find((p) => p.id == req.params.id);

  const { nome, preco } = req.body;

  const jaExiste = produtos.some(
    (p) =>
      p.nome.trim().toLowerCase() === nome.trim().toLowerCase() &&
      p.id != req.params.id
  );

  if (jaExiste) {
    console.log(`Produto já cadastrado.\n`);
    return res.send(`Produto  já cadastrado.\n`);
  }

  if (nome) produto.nome = nome;
  if (preco) produto.preco = preco;

  return res.send("Produto modificado com sucesso.");
});

//Rota para deletar um produto

app.delete("/produtos/:id", (req, res) => {
  const produto = produtos.find((p) => p.id == req.params.id);
  if (!produto) return res.send("Produto não encontrado");

  produtos = produtos.filter((p) => p.id != req.params.id);
  return res.send(`Produto removido com sucesso!`);
});

// 5. Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express rodando em <http://localhost:${port}`);
});
