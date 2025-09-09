-- SQLite 
-- Utilizando as duas tabelas anteriores, faça um join entre elas que mostre o nome do produto, quantidade e o nome da categoria.

SELECT 
  produtos.nome AS produto,
  categorias.nome AS categoria
FROM produtos
INNER JOIN categorias
ON produtos.categoria_id = categorias.id;

--Insira mais alguns dados que não tem relação nas duas tabelas
INSERT INTO produtos (nome, categoria_id) VALUES ('Caminhão', 10);
INSERT INTO produtos (nome, categoria_id) VALUES ('Carro', 12);
INSERT INTO produtos (nome, categoria_id) VALUES ('Motocicleta', 13);
INSERT INTO produtos (nome, categoria_id) VALUES ('Prateleira', 7);
INSERT INTO produtos (nome, categoria_id) VALUES ('Passaporte', 9);

INSERT INTO categorias (nome) VALUES ('Viagens');
INSERT INTO categorias (nome) VALUES ('Transporte');
INSERT INTO categorias (nome) VALUES ('Limpeza');

-- Monte um select que mostre todos os produtos que não têm uma categoria 

SELECT 
  produtos.nome AS produto,
  categorias.nome AS categoria
FROM produtos
LEFT JOIN categorias 
ON produtos.categoria_id = categorias.id
WHERE categoria IS NULL;

-- todas as categorias que não têm um produto relacionado.

SELECT 
  produtos.nome AS produto,
  categorias.nome AS categoria,
  categorias.id 
FROM categorias
LEFT JOIN produtos
ON produtos.categoria_id = categorias.id
WHERE produto IS NULL;

SELECT * FROM produtos;
SELECT * FROM categorias;


UPDATE produtos
SET categoria_id = 8
WHERE id = 7;

CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    departamento_id INTEGER NOT NULL
);

CREATE TABLE departamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

INSERT INTO funcionarios (nome, departamento_id) VALUES ('Alexia', 1);

SELECT * FROM funcionarios;

INSERT INTO departamentos (nome) VALUES ('BTP');

SELECT
    funcionarios.nome AS nome,
    departamentos.nome AS departamento
FROM funcionarios
INNER JOIN departamentos 
ON funcionarios.departamento_id = departamentos.id;


DROP TABLE funcionarios;
DROP TABLE departamentos;