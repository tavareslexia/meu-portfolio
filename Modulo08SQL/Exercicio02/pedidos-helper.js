const { runQuery, allQuery } = require("./database-helper.js");
const prompt = require("prompt");
prompt.delimiter = "\n";

async function criarTabelas() {
  try {
    // tabela produtos
    await runQuery(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL
      )
    `);
    // tabela pedidos
    await runQuery(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        data TEXT NOT NULL,
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
      )
    `);

    console.log("Tabelas criadas com sucesso!");
  } catch (err) {
    console.error("Erro ao criar tabelas:", err);
  }
}

async function criarPedido() {
  const sql = `INSERT INTO pedidos (produto_id, quantidade, data) VALUES (?,?,?);`;
  try {
    prompt.get(
      {
        properties: {
          produto: {
            description: "Digite o ID do produto:",
            required: true,
          },
          quantidade: {
            description: "Digite a quantidade:",
            pattern: /^\d+$/, // Regular expression that input must be valid against.
            message: "Por favor, digite um número.",
            required: true,
          },
          data: {
            description: "Digite a data do pedido:",
            required: true,
          },
        },
      },

      async (err, result) => {
        if (err) {
          console.error("Erro ao ler os dados:", err);
          return;
        }
        const params = [result.produto, result.quantidade, result.data];
        const pedidos = await runQuery(sql, params);
        console.log("Pedido cadastrado com sucesso.");
      }
    );
  } catch (error) {
    console.error("Falha ao criar pedido:", error);
  }
}

async function cadastrarProduto(params) {
  const sql = `INSERT INTO produtos (nome, preco) VALUES (?,?);`;

  try {
    prompt.get(
      {
        properties: {
          nome: {
            description: "Digite o nome do produto:",
            required: true,
          },
          preco: {
            description: "Digite o preço do produto:",
            pattern: /^\d+$/, // Regular expression that input must be valid against.
            message: "Por favor, digite um número.",
            required: true,
          },
        },
      },
      async (err, result) => {
        if (err) {
          console.error("Erro ao ler os dados:", err);
          return;
        }
        const params = [result.nome, result.preco];
        const pedidos = await runQuery(sql, params);
        console.log("Pedido cadastrado com sucesso.");
      }
    );
  } catch (error) {
    console.error("Falha ao criar pedido:", error);
  }
}

async function listarPedidos() {
  const sql = `SELECT pedidos.id, produtos.nome AS produto, pedidos.quantidade, pedidos.data FROM pedidos JOIN produtos ON pedidos.produto_id = produtos.id;`;
  try {
    const produtos = await allQuery(sql);
    produtos.forEach((p) => {
      console.log(
        `Pedido ${p.id}:  ${p.produto} - ${p.quantidade} - ${p.data} `
      );
    });
  } catch (error) {
    console.error("Falha ao listar pedidos", error);
  }
}

async function listarProdutos() {
  const sql = `SELECT produtos.id, produtos.nome, produtos.preco FROM produtos`;
  try {
    const produtos = await allQuery(sql);
    produtos.forEach((p) => {
      console.log(`Produto ${p.id}:  ${p.nome} - R$ ${p.preco} `);
    });
  } catch (error) {
    console.error("Falha ao listar produtos", error);
  }
}

async function atualizarPedido(params) {
  const sql = `UPDATE pedidos SET quantidade = (?) WHERE id = (?);`;
  try {
    prompt.get(
      {
        properties: {
          id: {
            description: "Digite o ID do pedido:",
            required: true,
          },
          quantidade: {
            description: "Digite a nova quantidade:",
            pattern: /^\d+$/, // Regular expression that input must be valid against.
            message: "Por favor, digite um número.",
            required: true,
          },
        },
      },
      async (err, result) => {
        if (err) {
          console.error("Erro ao ler os dados:", err);
          return;
        }
        const params = [result.quantidade, result.id];
        const pedidos = await runQuery(sql, params);
        if (pedidos.changes == 0) {
          console.log("Produto inexistente.");
          return;
        }
        console.log(`Pedido ${result.id} atualizado com sucesso.`);
      }
    );
  } catch (error) {
    console.error("Falha ao atualizar pedido:", error);
  }
}

async function excluirPedido(params) {
  const sql = `DELETE FROM pedidos WHERE id = (?);`;

  try {
    prompt.get(
      {
        properties: {
          id: {
            description: "Digite o ID do pedido:",
            required: true,
          },
        },
      },
      async (err, result) => {
        if (err) {
          console.error("Erro ao ler os dados:", err);
          return;
        }
        const params = [result.id];
        const pedidos = await runQuery(sql, params);
        if (pedidos.changes == 0) {
          console.log("Produto inexistente.");
          return;
        }

        console.log(`Pedido ${result.id} deletado com sucesso.`);
      }
    );
  } catch (error) {
    console.error("Falha ao deletar pedido:", error);
  }
}

module.exports = {
  listarPedidos,
  listarProdutos,
  atualizarPedido,
  excluirPedido,
  cadastrarProduto,
  criarPedido,
};
