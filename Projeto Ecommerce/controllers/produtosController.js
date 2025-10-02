// controllers/produtosController.js
const { runQuery, allQuery, getQuery } = require("../database/database-helper");
const { stringCompare, checkStatus } = require("../functions");

//Funções de verificação - Produtos
function checkInformation(
  nome,
  descricao,
  preco,
  status,
  estoque,
  id_categoria,
  res
) {
  if (
    !nome ||
    !descricao ||
    !preco ||
    (!status && status !== 0) ||
    (!estoque && estoque !== 0) ||
    !id_categoria
  ) {
    res.status(400).send({
      message: `O preenchimento de todas as informações é obrigatório.`,
    });
    return true;
  }
  return false;
}

async function checkProduct(nome, res, id = null) {
  let produtos;

  if (id) {
    produtos = await allQuery("SELECT nome FROM produtos WHERE id IS NOT (?)", [
      id,
    ]);
  } else {
    produtos = await allQuery("SELECT nome FROM produtos");
  }

  const jaExiste = produtos.some((p) => stringCompare(p.nome, nome));
  if (jaExiste) {
    res.status(400).send({
      message: `Produto ${nome} já cadastrado.`,
    });
    return true;
  }
  return false;
}

function checkChanges(result, res) {
  if (result.changes == 0 || result.length === 0) {
    res.status(404).send({
      message: `Produto não encontrado`,
    });
    return true;
  }
  return false;
}

function checkPriceAndQuantity(preco, estoque, res) {
  if (preco < 0 || estoque < 0) {
    res.status(400).send({
      message: `Preço e quantidade precisam ser maiores ou iguais a zero.`,
    });
    return true;
  }
  return false;
}

async function checkCapacity(id_categoria, id_produto, estoque, res) {
  sql_quantidade =
    "SELECT SUM(estoque) as estoque_atual FROM produtos WHERE id_categoria = ? AND id IS NOT ?";
  const quantidade = await allQuery(sql_quantidade, [id_categoria, id_produto]);
  estoque = parseInt(estoque);

  if (quantidade[0].estoque_atual + estoque > 100) {
    const capacidade = 100 - quantidade[0].estoque_atual;
    console.log(
      `Estoque da categoria não comporta a quantidade selecionada.Capacidade disponível: ${capacidade}`
    );
    res.status(400).send({
      message: `Estoque da categoria não comporta a quantidade selecionada. Capacidade disponível: ${capacidade}`,
    });
    return true;
  }
  return false;
}

// Controllers - Produtos

exports.createProduct = async (req, res, next) => {
  try {
    const { nome, descricao, preco, status, estoque, id_categoria } = req.body;

    // Verifica se todas as informações estão preenchidas
    if (
      checkInformation(
        nome,
        descricao,
        preco,
        status,
        estoque,
        id_categoria,
        res
      )
    ) {
      return;
    }

    // Verifica se o status é 0 ou 1
    if (checkStatus(status, res)) {
      return;
    }
    // Verifica se o produto já existe
    if (await checkProduct(nome, res)) {
      return;
    }

    //verifica se preço e estoque são maior que zero
    if (checkPriceAndQuantity(preco, estoque, res)) {
      return;
    }

    //Verifica se o estoque da categoria comporta a quantidade
    if (await checkCapacity(id_categoria, 0, estoque, res)) {
      return;
    }

    //Cria o produto
    const sql = `INSERT INTO produtos (nome, descricao, preco, status, estoque, id_categoria) 
    VALUES (?,?,?,?,?,?)`;
    await runQuery(sql, [
      nome,
      descricao,
      preco,
      status,
      estoque,
      id_categoria,
    ]);
    res
      .status(201)
      .json({ message: `Produto ${nome} cadastrado com sucesso.` });
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const sql = `SELECT p.id AS id_produto,p.nome ,p.descricao,p.status, p.preco, p.estoque,c.nome AS categoria 
    FROM produtos p LEFT JOIN categorias c ON p.id_categoria = c.id;`;
    const result = await allQuery(sql);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM produtos WHERE id =(?)`;
    const result = await getQuery(sql, [id]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM produtos WHERE id = (?)`;
    const result = await runQuery(sql, [id]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json("Produto deletado com sucesso.");
  } catch (error) {
    next(error);
  }
};

exports.editProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, status, id_categoria } = req.body;

    // Verifica se todas as informações estão preenchidas
    if (
      checkInformation(
        nome,
        descricao,
        preco,
        estoque,
        status,
        id_categoria,
        res
      )
    ) {
      return;
    }

    // Verifica se o status é 0 ou 1
    if (checkStatus(status, res)) {
      return;
    }

    // Verifica se o produto já existe
    if (await checkProduct(nome, res, id)) {
      return;
    }

    //verifica se preço e estoque são maior que zero
    if (checkPriceAndQuantity(preco, estoque, res)) {
      return;
    }

    //Verifica se o estoque da categoria comporta a quantidade
    console.log(estoque);
    console.log(id_categoria);
    if (await checkCapacity(id_categoria, id, estoque, res)) {
      return;
    }

    const sql = `UPDATE produtos SET nome = (?), descricao = (?), preco = (?), status = (?), estoque = (?), id_categoria = (?) WHERE id = (?)`;

    const result = await runQuery(sql, [
      nome,
      descricao,
      preco,
      status,
      estoque,
      id_categoria,
      id,
    ]);

    if (checkChanges(result, res)) {
      return;
    }

    res.status(200).json({ message: "Produto atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    next(error);
  }
};

//Listar produtos por categoria
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `SELECT p.id AS id_produto,p.nome ,p.descricao,p.status, p.preco, p.estoque,c.nome AS categoria 
    FROM produtos p LEFT JOIN categorias c ON p.id_categoria = c.id WHERE c.id = (?);`;
    const result = await allQuery(sql, [id]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//Filtrar produtos

exports.getProductsByFilter = async (req, res, next) => {
  try {
    const { nome } = req.params;
    const sql = `SELECT p.id AS id_produto,p.nome ,p.descricao,p.status, p.preco, p.estoque,c.nome AS categoria 
    FROM produtos p LEFT JOIN categorias c ON p.id_categoria = c.id WHERE p.nome LIKE (?);`;
    const result = await allQuery(sql, [`%${nome}%`]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
