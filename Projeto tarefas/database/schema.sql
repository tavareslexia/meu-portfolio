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

ALTER TABLE tarefas
ADD data_criacao DATE;

ALTER TABLE usuarios
ADD email TEXT;

ALTER TABLE usuarios
ADD senha TEXT;