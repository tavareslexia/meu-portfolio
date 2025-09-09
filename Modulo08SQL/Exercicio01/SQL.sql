--Crie uma tabela chamada produtos com 3 colunas: identificador numerico,  um campo de texto para o nome e um campo numerico para o preço.ABORT

CREATE TABLE produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preço REAL NOT NULL
);