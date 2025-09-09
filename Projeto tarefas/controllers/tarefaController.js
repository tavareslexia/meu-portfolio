// controllers/tarefaController.js
const { runQuery, allQuery, getQuery } = require("../database/database-helper");

exports.createTask = async (req, res, next) => {
  try {
    const { titulo, descricao, user } = req.body;
    if (!titulo) {
      return res.status(400).json({ error: "O título é obrigatório." });
    }
    const sql = `INSERT INTO tarefas (titulo, descricao, usuario_id, concluida, data_criacao) 
    VALUES (?,?,?, 0,datetime('now'))`;
    const result = await runQuery(sql, [titulo, descricao, user]);
    res
      .status(201)
      .json({ id: result.lastID, titulo, descricao, concluida: 0 });
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const sql = `SELECT t.id AS tarefa_id,t.titulo,t.descricao,t.concluida,u.nome AS usuario_nome 
    FROM tarefas t LEFT JOIN usuarios u ON t.usuario_id = u.id;`;
    const tarefas = await allQuery(sql);
    res.status(200).json(tarefas);
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM tarefas WHERE id =?`;
    const tarefa = await getQuery(sql, [id]);
    if (!tarefa) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.status(200).json(tarefa);
  } catch (error) {
    next(error);
  }
};

exports.deleteTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM tarefas WHERE id = (?)`;
    const result = await runQuery(sql, [id]);
    if (result.changes == 0) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.editTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sql = `UPDATE tarefas SET concluida = (?) WHERE id = (?);`;
    const result = await runQuery(sql, [status, id]);
    if (result.changes == 0) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.status(200).json({ message: "Tarefa atualizada com sucesso." });
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};
