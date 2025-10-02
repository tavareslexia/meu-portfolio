//categoriasController.js
const { runQuery, allQuery, getQuery } = require("../database/database-helper");
const { stringCompare, checkStatus } = require("../functions");

//Funções de verificação - Categoria
function checkInformation(nome, status, res) {
  if (!nome || (!status && status !== 0)) {
    res.status(400).send({
      message: "O preenchimento de todas as informações é obrigatório.",
    });
    return true;
  }
  return false;
}

async function checkCategory(nome, res, id = null) {
  let categorias;
  if (id) {
    categorias = await allQuery(
      "SELECT nome FROM categorias WHERE id IS NOT (?)",
      [id]
    );
  } else {
    categorias = await allQuery("SELECT nome FROM categorias");
  }

  const jaExiste = categorias.some((p) => stringCompare(p.nome, nome));
  if (jaExiste) {
    res.status(400).send({
      message: "Nome da categoria já cadastrado, digite um nome diferente.",
    });
    return true;
  }
  return false;
}

function checkChanges(result, res) {
  if (!result || result.changes === 0) {
    res.status(404).send({
      message: "Categoria não encontrada ou sem alterações.",
    });
    return true;
  }
  return false;
}
//Controllers categoria

exports.createCategory = async (req, res, next) => {
  try {
    const { nome, status } = req.body;

    // Verifica se todas as informações estão preenchidas
    if (checkInformation(nome, status, res)) {
      return;
    }

    // Verifica se o status é 0 ou 1
    if (checkStatus(status, res)) {
      return;
    }
    // Verifica se a categoria já existe
    if (await checkCategory(nome, res)) {
      return;
    }

    //Cria a categoria
    const sql = `INSERT INTO categorias (nome, status) VALUES (?,?)`;
    await runQuery(sql, [nome, status]);
    res.status(201).send(`Categoria ${nome} criada com sucesso.`);
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const sql = `SELECT id, nome, status FROM categorias;`;
    const result = await allQuery(sql);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM categorias WHERE id =?`;
    const result = await getQuery(sql, [id]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM categorias WHERE id = (?)`;
    const result = await runQuery(sql, [id]);
    if (checkChanges(result, res)) {
      return;
    }
    res.status(200).json({ error: "Categoria deletada com sucesso" });
  } catch (error) {
    next(error);
  }
};

exports.editCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, status } = req.body;

    // Verifica se todas as informações estão preenchidas
    if (checkInformation(nome, status, res)) {
      return;
    }

    // Verifica se o status é 0 ou 1
    if (checkStatus(status, res)) {
      return;
    }
    // Verifica se a categoria já existe
    if (await checkCategory(nome, res, id)) {
      return;
    }

    //Atualiza as informações
    const sql = `UPDATE categorias SET nome = (?),status = (?) WHERE id = (?);`;
    const result = await runQuery(sql, [nome, status, id]);

    if (checkChanges(result, res)) {
      return;
    }

    res.status(200).send({
      message: `Categoria atualizada com sucesso.`,
    });
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};
