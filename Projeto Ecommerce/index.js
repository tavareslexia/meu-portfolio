require("dotenv").config(); // carrega o .env

const port = process.env.PORT || 3000;
const dbPath = process.env.DATABASE_PATH;

// index.js
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const produtosRoutes = require("./routes/produtos");
const categoriasRoutes = require("./routes/categorias");
const pedidosRoutes = require("./routes/pedidos");
const carrinhoRoutes = require("./routes/carrinho");
const itensRoutes = require("./routes/itens");

// Montar rotas
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/produtos", produtosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/carrinho", carrinhoRoutes);
app.use("/itens", itensRoutes);

// Middleware de tratamento de erros (DEVE SER O ÚLTIMO)
app.use((err, req, res, next) => {
  console.error(err.stack); // Loga o erro completo no console para depuração

  // Define um status de erro padrão
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro Interno do Servidor";

  // Envia uma resposta JSON padronizada
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
