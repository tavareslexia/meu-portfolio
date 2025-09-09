const express = require("express");

const app = express();
// app.use(express.urlencoded({ extended: true })); // para ler os dados do form
app.use(express.json());
const port = 3000;

const produtos = [];

const path = require("path");
app.use(express.static(path.join(__dirname))); //pega config do file CSS

// Rota inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota para adicionar produto
app.post("/produto", (req, res) => {
  const { nome, quantidade } = req.body;

  if (!nome || !quantidade) {
    return res.status(400).send("Nome e quantidade são obrigatórios.");
  }

  const jaExiste = produtos.some(
    (p) => p.nome.trim().toLowerCase() === nome.trim().toLowerCase()
  );

  if (jaExiste) {
    console.log(`Produto "${nome}" já cadastrado.\n`);
    return res.send(`Produto "${nome}" já cadastrado.\n`);
  }
  produtos.push({ nome: nome.trim(), quantidade: parseInt(quantidade, 10) });
  console.log(`Produto "${nome}" cadastrado.\n`);
  return res.send(`Produto "${nome}" cadastrado com sucesso!`);
});

// Rota para visualizar produtos existentes
app.get("/produtos", (req, res) => {
  res.send(produtos);
});

// 5. Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express rodando em <http://localhost:${port}`);
});
