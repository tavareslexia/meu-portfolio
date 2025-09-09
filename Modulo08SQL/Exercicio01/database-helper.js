// Importa o módulo do banco de dados
const db = require("./database.js");

// Função para executar queries que não retornam resultados (INSERT, UPDATE, DELETE)
function runQuery(sql, params = []) {
  // sql = comando SQL, params = array de parâmetros opcionais
  return new Promise((resolve, reject) => {
    // Retorna uma Promise para usar async/await
    db.get("PRAGMA foreign_keys=1");
    db.run(sql, params, function (err) {
      // Executa a query no banco
      if (err) {
        // Se houver erro
        console.error("Erro ao executar a query", err); // Mostra o erro no console
        reject(err); // Rejeita a Promise com o erro
      } else {
        // Se der certo
        resolve({ lastID: this.lastID, changes: this.changes });
        // Retorna um objeto com lastID (ID do último registro inserido) e changes (quantos registros foram alterados)
      }
    });
  });
}

// Função para executar queries que retornam apenas uma linha (SELECT único)
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      // db.get retorna apenas a primeira linha encontrada
      if (err) {
        console.error("Erro ao executar a query", err);
        reject(err);
      } else {
        resolve(row); // Retorna a linha encontrada
      }
    });
  });
}

// Função para executar queries que retornam várias linhas (SELECT múltiplo)
function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      // db.all retorna todas as linhas encontradas
      if (err) {
        console.error("Erro ao executar a query", err);
        reject(err);
      } else {
        resolve(rows); // Retorna todas as linhas como um array
      }
    });
  });
}

// Exporta as funções para que possam ser usadas em outros arquivos
module.exports = { runQuery, getQuery, allQuery };
