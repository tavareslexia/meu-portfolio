// index.js
const express = require("express");
const path = require("path");
const app = express();
const tarefaRoutes = require("./routes/tarefas");
const usuarioRoutes = require("./routes/usuarios");

// Montar rotas
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/usuarios", usuarioRoutes);
app.use("/tarefas", tarefaRoutes);

// (Adicionaremos o middleware de erro aqui no próximo módulo)

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
