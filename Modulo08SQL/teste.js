// const db = require("./database.js");

// const sql = `INSERT INTO tarefas (titulo, descricao) VALUES (?,?)`;
// const params = ["Almoçar", "Comer ao meio dia"];

// // const sql = `DELETE FROM tarefas WHERE id=?`;
// // const params = [1];

// db.run(sql, params, function (err) {
//   if (err) {
//     return console.error(err.message);
//   }
//   // 'this.lastID' contém o ID do registro recém-inserido
//   console.log(`Uma nova tarefa foi inserida com o ID: ${this.lastID}`);
// });

const { runQuery, getQuery, allQuery } = require("./database-helper.js");

async function listarTarefas() {
  const sql = `SELECT * FROM tarefas`;
  try {
    const tarefas = await allQuery(sql);
    console.log(tarefas);
  } catch (error) {
    console.error("Falha ao listar tarefas:", error);
  }
}

listarTarefas();
