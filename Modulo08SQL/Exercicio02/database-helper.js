const db = require("./database.js");

function runQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.get("PRAGMA foreign_keys=1");
    db.run(sql, params, function (err) {
      if (err) {
        if (err.code == "SQLITE_CONSTRAINT") {
          console.log("Produto inexistente.");
          reject;
        }
        console.error("Erro ao executar a query", err);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

function getQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error("Erro ao executar a query", err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Erro ao executar a query", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { runQuery, getQuery, allQuery };
