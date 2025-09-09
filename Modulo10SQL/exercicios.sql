
--Lista de pedidos com nome do cliente 
SELECT
  p.id_pedido,
  c.nome,
  p.data_pedido,
  p.valor
FROM Pedidos p
INNER JOIN Clientes c
  ON p.id_cliente = c.id_cliente;


--Lista de pedidos com o nome do cliente, nome do produto e total 
SELECT
  p.id_pedido,
  c.nome AS cliente,
  pr.nome AS produto,
  i.quantidade,
  pr.preco,
  (i.quantidade * pr.preco) AS total_item
FROM Itens_Pedido i
JOIN Pedidos p
  ON i.id_pedido = p.id_pedido
JOIN Clientes c
  ON p.id_cliente = c.id_cliente
JOIN Produtos pr
  ON i.id_produto = pr.id_produto;


--Lista de cidades dos clientes 
select cidade from Clientes group by cidade;

--Lista com quantidade de clientes por cidade 
SELECT
  cidade,
  COUNT(*) AS quantidade
FROM Clientes
GROUP BY cidade
ORDER BY quantidade DESC;

--Lista de número de pedidos por cliente 
SELECT
  c.nome,
  COUNT(p.id_pedido) AS total_pedidos
FROM Clientes c
LEFT JOIN Pedidos p
  ON c.id_cliente = p.id_cliente
GROUP BY c.nome;

-- lista total de vendas por cidade 
SELECT
  c.cidade,
  SUM(p.valor) AS total_vendas
FROM Pedidos p
JOIN Clientes c
  ON c.id_cliente = p.id_cliente
GROUP BY c.cidade;

--Lista com quantidade de pedidos por cidade 
SELECT
  cidade,
  COUNT(*) AS quantidade
FROM Pedidos
JOIN Clientes
    ON Clientes.id_cliente = Pedidos.id_cliente
GROUP BY cidade
ORDER BY quantidade DESC;

--Valor médio dos pedidos
SELECT
 AVG(valor) AS media_valor_pedidos
FROM Pedidos;

--Maior pedido feito
SELECT
  MAX(valor) AS pedido_mais_caro,
  c.nome
FROM Pedidos p
join Clientes c
on p.id_cliente = c.id_cliente

--Menor pedido feito
SELECT
  MIN(valor) AS pedido_mais_caro,
  c.nome
FROM Pedidos p
join Clientes c
on p.id_cliente = c.id_cliente

--Ambos
SELECT
  MAX(valor) AS pedido_mais_caro,
  MIN(valor) AS pedido_mais_barato
FROM Pedidos;

--Lista o total de pedidos, total de produtos, total gasto, media, maior e menor pedido por cliente

SELECT 
    c.id_cliente,
    UPPER(c.nome) AS nome_maiusculo,
    LOWER(c.cidade) AS cidade_minusculo,
    COUNT(DISTINCT p.id_pedido) AS total_pedidos,
    COUNT(DISTINCT pr.id_produto) AS produtos_diferentes,
    SUM(i.quantidade * pr.preco) AS total_gasto,
    AVG(p.valor) AS media_pedido,
    MAX(p.valor) AS maior_pedido,
    MIN(p.valor) AS menor_pedido
FROM Clientes c

LEFT JOIN
  Pedidos p
ON
  c.id_cliente = p.id_cliente

LEFT JOIN
  Itens_Pedido i
ON
  p.id_pedido = i.id_pedido

LEFT JOIN
  Produtos pr
ON
  i.id_produto = pr.id_produto

GROUP BY c.id_cliente, c.nome, c.cidade

ORDER BY total_gasto DESC;


--Lista clientes que gastam acima da média

SELECT
  nome,
  id_cliente
FROM
  Clientes
WHERE
  id_cliente IN (
    SELECT
      id_cliente
    FROM Pedidos
    GROUP BY id_cliente
    HAVING SUM(valor) > (
      SELECT AVG(valor) FROM Pedidos
    )
 );


--Produto mais caro de um pedido 


SELECT
  pr.nome,
  pr.preco
FROM
  Produtos pr
WHERE
  pr.id_produto IN (
    SELECT id_produto FROM Itens_Pedido WHERE id_pedido = 3
  )
ORDER BY preco DESC
LIMIT 1;


