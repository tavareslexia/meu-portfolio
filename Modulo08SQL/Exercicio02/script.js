const {
  listarPedidos,
  listarProdutos,
  atualizarPedido,
  excluirPedido,
  cadastrarProduto,
  criarPedido,
} = require("./pedidos-helper.js");

const prompt = require("prompt");

prompt.delimiter = "\n";

prompt.start();

prompt.get(
  {
    properties: {
      operacao: {
        description:
          "Qual operacao deseja realizar? \n 01 - Listar pedidos \n 02 - Listar produtos \n 03 - Atualizar pedido \n 04 - Criar novo pedido \n 05 - Cadastrar novo produto \n 06 - Excluir pedido ",
      },
    },
  },
  (err, result) => {
    if (err) {
      console.error("Erro ao ler os dados:", err);
      return;
    }
    const operacao = result.operacao;

    switch (operacao) {
      case "01 - Listar pedidos":
        return listarPedidos();
      case "02 - Listar produtos":
        return listarProdutos();
      case "03 - Atualizar pedido":
        return atualizarPedido();
      case "04 - Criar novo pedido":
        return criarPedido();
      case "05 - Cadastrar novo produto":
        return cadastrarProduto();
      case "06 - Excluir pedido":
        return excluirPedido();
      default:
        return "Operação inválida. Use: 01 - Listar pedidos \n 02 - Listar produtos \n 03 - Atualizar pedido \n 04 - Criar novo pedido \n 05 - Cadastrar novo produto \n 06 - Excluir pedido";
    }
  }
);
