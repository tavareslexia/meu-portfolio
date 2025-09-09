--Criar tabelas
CREATE TABLE Clientes (
  id_cliente INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cidade TEXT,
  idade INTEGER
);

CREATE TABLE Pedidos (
    id_pedido INTEGER PRIMARY KEY,
    id_cliente INTEGER,
    data_pedido DATE,
    valor REAL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);

CREATE TABLE Produtos (
    id_produto INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    preco REAL
);

CREATE TABLE Itens_Pedido (
    id_item INTEGER PRIMARY KEY,
    id_pedido INTEGER,
    id_produto INTEGER,
    quantidade INTEGER,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_produto) REFERENCES Produtos(id_produto)
);

-- Inserir dados
INSERT INTO Clientes (nome, cidade, idade) VALUES('Ana', 'São Paulo', 30);
INSERT INTO Clientes (nome, cidade, idade) VALUES('Bruno', 'Rio de Janeiro', 25);
INSERT INTO Clientes (nome, cidade, idade) VALUES('Carla', 'São Paulo', 40);
INSERT INTO Clientes (nome, cidade, idade) VALUES('Diego', 'Belo Horizonte', 35);

INSERT INTO Pedidos (id_cliente, data_pedido, valor) VALUES(1, '2025-01-10', 500);
INSERT INTO Pedidos (id_cliente, data_pedido, valor) VALUES(2, '2025-01-15', 200);
INSERT INTO Pedidos (id_cliente, data_pedido, valor) VALUES(1, '2025-02-01', 300);
INSERT INTO Pedidos (id_cliente, data_pedido, valor) VALUES(3, '2025-02-10', 1000);

INSERT INTO Produtos (nome, preco) VALUES('Notebook', 2500);
INSERT INTO Produtos (nome, preco) VALUES('Mouse', 50);
INSERT INTO Produtos (nome, preco) VALUES('Teclado', 120);
INSERT INTO Produtos (nome, preco) VALUES('Monitor', 900);

INSERT INTO Itens_Pedido (id_pedido, id_produto, quantidade) VALUES(1, 1, 1);-- Pedido 1, Notebook
INSERT INTO Itens_Pedido (id_pedido, id_produto, quantidade) VALUES(1, 2, 2);-- Pedido 1, 2 Mouses
INSERT INTO Itens_Pedido (id_pedido, id_produto, quantidade) VALUES(2, 3, 1);-- Pedido 2, 1 Teclado
INSERT INTO Itens_Pedido (id_pedido, id_produto, quantidade) VALUES(3, 2, 1);-- Pedido 3, 1 Mouse
INSERT INTO Itens_Pedido (id_pedido, id_produto, quantidade) VALUES(3, 4, 1);-- Pedido 3, 1 Monitor
INSERT INTO Itens_Pedido (id_pedido, id_produto, quantidade) VALUES(4, 1, 2);-- Pedido 4, 2 Notebooks
