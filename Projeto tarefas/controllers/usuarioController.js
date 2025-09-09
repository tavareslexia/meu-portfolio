const { runQuery, allQuery, getQuery } = require("../database/database-helper");
const bcrypt = require("bcrypt");

//login

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }
    // buscar o usuario no banco
    const usuario = await getQuery(
      "SELECT email, senha FROM usuarios WHERE email = ?",
      [email]
    );
    // verificar se existe
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    //comparar senha
    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
      return res.status(401).json({ error: "Acesso negado" });
    }
    return res.status(200).json({ message: "Acesso liberado" });
  } catch (error) {
    next(error);
  }
};

// Criar usuário
exports.createUser = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?,?,?)";
    const hash = await bcrypt.hash(senha, 10);
    const result = await runQuery(sql, [nome, email, hash]);

    res.status(201).json({ id: result.lastID, nome, email });
  } catch (error) {
    next(error);
  }
};

// Listar todos os usuários
exports.getAllUsers = async (req, res, next) => {
  try {
    const sql = "SELECT id, nome, email, senha FROM usuarios";
    const users = await allQuery(sql);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Obter usuário por ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = "SELECT id, nome, email, senha FROM usuarios WHERE id = ?";
    const user = await getQuery(sql, [id]);

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Atualizar usuário
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    if (!nome && !email && !senha) {
      return res
        .status(400)
        .json({ error: "Envie pelo menos um campo para atualizar." });
    }

    const campos = [];
    const valores = [];

    if (nome) {
      campos.push("nome = ?");
      valores.push(nome);
    }
    if (email) {
      campos.push("email = ?");
      valores.push(email);
    }
    if (senha) {
      campos.push("senha = ?");
      valores.push(senha);
    }

    valores.push(id);
    const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`;
    const result = await runQuery(sql, valores);

    if (result.changes === 0)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.status(200).json({ message: "Usuário atualizado com sucesso." });
  } catch (error) {
    next(error);
  }
};

// Deletar usuário
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    const result = await runQuery(sql, [id]);

    if (result.changes === 0)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.status(200).json({ message: "Usuário deletado com sucesso." });
  } catch (error) {
    next(error);
  }
};
