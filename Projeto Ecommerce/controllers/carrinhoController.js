//CarrinhoController.js
const { runQuery, allQuery, getQuery } = require("../database/database-helper");
const { validateNumber } = require("../functions");

//Funções de verificação - Carrinho

function checkChanges(result, res) {
  if (result.changes == 0) {
    res.status(404).json({ error: "Item não encontrado." });
    return true;
  }
  return false;
}

//Controllers carrinho

//criar item no carrinho OK
exports.createCarrinho = async (req, res, next) => {
  try {
    const { id_produto, quantidade } = req.body;

    // Validações
    const prodNum = validateNumber(id_produto, "id_produto", res, 1);
    const qtdNum = validateNumber(quantidade, "quantidade", res, 0);

    // se algum vier nulo sai da função
    if (prodNum === null || qtdNum === null) return;

    //Cria o item
    const sql = `INSERT INTO carrinho (id_produto, quantidade) VALUES (?,?)`;
    await runQuery(sql, [prodNum, qtdNum]);
    res.status(201).send(`Item criado com sucesso.`);
  } catch (error) {
    console.error("Erro ao criar item no carrinho:", error);
    next(error); // Passa o erro para o middleware de erro
  }
};

//pegar lista de itens do carrinho
exports.getAllCarrinho = async (req, res, next) => {
  try {
    const sql = `SELECT
              c.id,
              p.nome AS produto,
              p.id AS id_produto,
              p.preco AS preco_unitario,
              p.descricao AS descricao,
              p.estoque AS estoque_disponivel,
              c.quantidade,
              (c.quantidade * p.preco) AS subtotal
              FROM carrinho c
              LEFT JOIN produtos p
              WHERE c.id_produto = p.id;`;
    const result = await allQuery(sql);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//lista um item do carrinho OK
exports.getItemByIdCarrinho = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validações
    const id_carrinho = validateNumber(id, "id_carrinho", res, 1);

    // se algum vier nulo sai da função
    if (id_carrinho === null) return;

    const sql = `SELECT * FROM carrinho WHERE id =?`;
    const result = await getQuery(sql, [id_carrinho]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//limpar o carrinho
exports.deleteCarrinho = async (req, res, next) => {
  try {
    const sql = `DELETE FROM carrinho`;
    const result = await runQuery(sql);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ error: "Carrinho limpo." });
  } catch (error) {
    next(error);
  }
};

//remover item do carrinho OK
exports.deleteItemByIdCarrinho = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validações
    const id_carrinho = validateNumber(id, "id_carrinho", res, 1);

    // se algum vier nulo sai da função
    if (id_carrinho === null) return;

    const sql = `DELETE FROM carrinho WHERE id = (?)`;
    const result = await runQuery(sql, [id_carrinho]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ error: "Item deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};

//editar itens do carrinho OK
exports.editItemByIdCarrinho = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_produto, quantidade } = req.body;

    // Validações
    const carrinhoNum = validateNumber(id, "id_carrinho", res, 1);
    const prodNum = validateNumber(id_produto, "id_produto", res, 1);
    const qtdNum = validateNumber(quantidade, "quantidade", res, 0);

    // se algum vier nulo sai da função
    if (prodNum === null || qtdNum === null || carrinhoNum === null) return;

    //Atualiza as informações
    const sql = `UPDATE carrinho SET id_produto = (?), quantidade = (?) WHERE id = (?);`;
    const result = await runQuery(sql, [prodNum, qtdNum, carrinhoNum]);

    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ message: "Item atualizado com sucesso." });
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};
