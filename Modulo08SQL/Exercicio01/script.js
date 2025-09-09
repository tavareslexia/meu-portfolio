const { runQuery, getQuery, allQuery } = require("./database-helper.js");

async function adicionarProdutos(params) {
  const sql = `INSERT INTO produtos (nome, preço) VALUES (?,?);`;
  try {
    const produtos = await runQuery(sql, params);
    console.log(produtos);
  } catch (error) {
    console.error("Falha ao adicionar produto:", error);
  }
}

async function listarProdutos() {
  const sql = `SELECT * FROM produtos`;
  try {
    const produtos = await allQuery(sql);
    produtos.forEach((p) => {
      console.log(
        `Produto ${p.id}: ${p.nome} – Preço: R$${p.preço.toFixed(2)}`
      );
    });
  } catch (error) {
    console.error("Falha ao listar produtos:", error);
  }
}

// adicionarProdutos(["Mouse", 80]);
// adicionarProdutos(["Teclado", 150]);

listarProdutos();
