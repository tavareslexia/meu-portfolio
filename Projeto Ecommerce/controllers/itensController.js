//itensController.js
const { runQuery, allQuery, getQuery } = require("../database/database-helper");
const { validateNumber } = require("../functions");

//Funções de verificação - Itens

function checkChanges(result, res) {
  if (!result) {
    res.status(404).json({ error: "Sem itens cadastrados para esse pedido." });
    return true;
  }
  if (result.changes == 0) {
    res.status(404).json({ error: "Item não encontrado." });
    return true;
  }
  return false;
}

//Controllers itens

exports.createItem = async (req, res, next) => {
  try {
    const { id_pedido, id_produto, quantidade, preco_unitario, subtotal } =
      req.body;

    const numPedido = validateNumber(id_pedido, "id_pedido", res, 1);
    const numProduto = validateNumber(id_produto, "id_produto", res, 1);
    const numQtde = validateNumber(quantidade, "quantidade", res, 0);
    const numPreco = validateNumber(preco_unitario, "preco_unitario", res, 0);
    const numSubTotal = validateNumber(subtotal, "subtotal", res, 0);

    //Cria o item
    const sql = `INSERT INTO itensPedido (id_pedido, id_produto,quantidade, preco_unitario, subtotal) VALUES (?,?,?,?,?)`;
    await runQuery(sql, [
      numPedido,
      numProduto,
      numQtde,
      numPreco,
      numSubTotal,
    ]);
    res.status(201).send(`Item criado com sucesso.`);
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

exports.getAllItems = async (req, res, next) => {
  try {
    const sql = `SELECT
                  ip.id,
                  ip.id_pedido,
                  ip.id_produto,
                  p.nome AS produto,
                  ip.quantidade,
                  p.preco AS preco_unitario,
                  (ip.quantidade * p.preco) AS subtotal
                  FROM itensPedido ip 
                  LEFT JOIN produtos p 
                  ON ip.id_produto = p.id
                  GROUP BY ip.id;`;
    const result = await allQuery(sql);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    numId = validateNumber(id, "id_item", res, 1);
    const sql = `SELECT
                  ip.id,
                  ip.id_pedido,
                  ip.id_produto,
                  p.nome AS produto,
                  ip.quantidade,
                  p.preco AS preco_unitario,
                  (ip.quantidade * p.preco) AS subtotal
                  FROM itensPedido ip 
                  LEFT JOIN produtos p 
                  ON ip.id_produto = p.id
                  WHERE ip.id =(?)
                  GROUP BY ip.id;`;
    const result = await getQuery(sql, [numIdd]);
    console.log(result);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    numId = validateNumber(id, "id_item", res, 1);

    const sql = `DELETE FROM itensPedido WHERE id = (?)`;
    const result = await runQuery(sql, [numId]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ error: "Item deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};

exports.editItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_pedido, id_produto, quantidade, preco_unitario, subtotal } =
      req.body;

    //Atualiza as informações
    const sql = `UPDATE itensPedido SET  id_pedido = (?), id_produto = (?), quantidade = (?), preco_unitario = (?),subtotal = (?) WHERE id = (?);`;
    const result = await runQuery(sql, [
      id_pedido,
      id_produto,
      quantidade,
      preco_unitario,
      subtotal,
      id,
    ]);

    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ message: "Item atualizado com sucesso." });
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

exports.getItemByOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `SELECT
                  ip.id,
                  ip.id_pedido,
                  ip.id_produto,
                  p.nome AS produto,
                  ip.quantidade,
                  p.preco AS preco_unitario,
                  (ip.quantidade * p.preco) AS subtotal
                  FROM itensPedido ip 
                  LEFT JOIN produtos p 
                  ON ip.id_produto = p.id
                  WHERE ip.id_pedido = (?);`;
    const result = await allQuery(sql, [id]);
    console.log(result);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};
