--Criacao tabela categorias
CREATE TABLE categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  status INTEGER DEFAULT 0
);

--Criacao tabela produtos
CREATE TABLE produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco REAL NOT NULL,
  estoque INTEGER NOT NULL,
  status INTEGER DEFAULT 0,
  id_categoria INTEGER NOT NULL,
  FOREIGN KEY(id_categoria) REFERENCES categorias(id)
);

--Criacao tabela pedidos
CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT DEFAULT (date('now')),
    hora TEXT DEFAULT (time('now')),
    quantidade_itens INTEGER NOT NULL,
    valor_total REAL NOT NULL
);

--Criacao tabela de itens por pedido
CREATE TABLE itensPedido(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

--Criacao tabela carrinho
CREATE TABLE carrinho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    FOREIGN KEY(id_produto) REFERENCES produtos(id)
);


DELETE FROM categorias;

