--Criacao tabela usuarios
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);

--Criacao tabela tarefas
CREATE TABLE tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  concluida INTEGER DEFAULT 0,
  usuario_id INTEGER,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

--Criacao tabela categorias

CREATE TABLE categorias(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE produtos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria_id INTEGER,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Inserindo categorias
INSERT INTO categorias (nome) VALUES ('Eletrônicos');
INSERT INTO categorias (nome) VALUES ('Alimentos');
INSERT INTO categorias (nome) VALUES ('Vestuário');

-- Inserindo produtos
INSERT INTO produtos (nome, categoria_id)
VALUES ('Celular', 1);

INSERT INTO produtos (nome, categoria_id)
VALUES ('Arroz', 2);

INSERT INTO produtos (nome, categoria_id)
VALUES ('Camiseta', 3);

--JOIN entre as tabelas 

SELECT 
  produtos.nome AS produto
  categorias.nome AS categoria
FROM produtos
INNER JOIN categorias
ON produtos.categoria_id = categorias.id;