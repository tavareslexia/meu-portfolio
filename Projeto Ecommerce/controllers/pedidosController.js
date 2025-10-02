//pedidosController.js
const { runQuery, allQuery, getQuery } = require("../database/database-helper");

//Funções de verificação - Pedidos

function checkChanges(result, res) {
  if (result.changes == 0) {
    res.status(404).json({ error: "Pedido não encontrado." });
    return true;
  }
  return false;
}

//Controllers pedidos

exports.createOrder = async (req, res, next) => {
  try {
    const carrinhoSQL = `
  SELECT 
    c.id_produto, 
    c.quantidade,
    p.preco,
    p.nome as produto_nome,
    (c.quantidade * p.preco) as subtotal
  FROM carrinho c
  INNER JOIN produtos p ON c.id_produto = p.id
`;
    const itensCarrinho = await allQuery(carrinhoSQL);

    if (!itensCarrinho || itensCarrinho.length === 0) {
      return res.status(201).send(`Carrinho vazio.`);
    }

    const quantidade_itens = itensCarrinho.length;
    let valor_total = 0;

    for (const item of itensCarrinho) {
      valor_total += item.subtotal;
    }

    const pedidoSql = `INSERT INTO pedidos (data, hora, quantidade_itens, valor_total) VALUES (date('now'),time('now'),?,?)`;
    const resultPedido = await runQuery(pedidoSql, [
      quantidade_itens,
      valor_total,
    ]);

    const id_pedido = resultPedido.lastID;

    for (const item of itensCarrinho) {
      const itemSql = `INSERT INTO itensPedido (id_pedido, id_produto, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)`;

      await runQuery(itemSql, [
        id_pedido,
        item.id_produto,
        item.quantidade,
        item.preco,
        item.subtotal,
      ]);
      // const updateProdutoSql = `UPDATE produtos SET estoque = estoque - ? WHERE id = ?`;
      // await runQuery(updateProdutoSql, [item.quantidade, item.id_produto]);
    }

    res.status(200).send(`Pedido criado com sucesso.`);
    const limparCarrinhoSql = `DELETE FROM carrinho`;
    await runQuery(limparCarrinhoSql);
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const sql = `SELECT 
            p.id,
            p.data, 
            p.hora, 
            p.valor_total, 
            SUM(ip.quantidade) AS quantidade_itens,
            SUM(ip.subtotal) AS valor_total
            FROM pedidos p 
            LEFT JOIN itensPedido ip
            ON p.id = ip.id_pedido
            GROUP BY p.id;`;
    const result = await allQuery(sql);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM pedidos WHERE id =?`;
    const result = await getQuery(sql, [id]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM pedidos WHERE id = (?)`;
    const result = await runQuery(sql, [id]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ error: "Pedido deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};

exports.editOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantidade_itens, valor_total } = req.body;

    //Atualiza as informações
    const sql = `UPDATE pedidos SET quantidade_itens = (?),valor_total = (?) WHERE id = (?);`;
    const result = await runQuery(sql, [quantidade_itens, valor_total, id]);
    if (checkChanges(result)) {
      return;
    }
    res.status(200).json({ message: "Pedido atualizado com sucesso." });
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

exports.filterOrders = async (req, res, next) => {
  try {
    const { dataInicial, dataFinal, valorMinimo, valorMaximo } = req.query;

    let sql = `
      SELECT 
        id,
        data,
        hora,
        valor_total,
        quantidade_itens
      FROM pedidos 
      WHERE 1=1
    `;

    const params = [];

    // Filtro por data
    if (dataInicial && dataFinal) {
      sql += ` AND DATE(data) BETWEEN DATE(?) AND DATE(?)`;
      params.push(dataInicial, dataFinal);
    } else if (dataInicial) {
      sql += ` AND DATE(data) >= DATE(?)`;
      params.push(dataInicial);
    } else if (dataFinal) {
      sql += ` AND DATE(data) <= DATE(?)`;
      params.push(dataFinal);
    }

    // Filtro valores
    if (valorMinimo && valorMaximo) {
      sql += ` AND valor_total BETWEEN ? AND ?`;
      params.push(parseFloat(valorMinimo), parseFloat(valorMaximo));
    } else if (valorMinimo) {
      sql += ` AND valor_total >= ?`;
      params.push(parseFloat(valorMinimo));
    } else if (valorMaximo) {
      sql += ` AND valor_total <= ?`;
      params.push(parseFloat(valorMaximo));
    }

    sql += ` ORDER BY data DESC`;

    const pedidos = await allQuery(sql, params);

    res.status(200).json(pedidos);
  } catch (error) {
    next(error);
  }
};
