---Crie um select que traga: 
--o nome do cliente maiúsculo e minúsculo
-- quantos pedidos cada cliente realizou
-- quantos produtos diferentes compraram
-- o valor total gasto, a média
-- maior e menor pedido de cada cliente
-- Ordene pelo total gasto (do maior para o menor)

SELECT 
    UPPER(c.nome) AS nome_maiusculo,
    LOWER(c.nome) AS nome_minusculo,
    COUNT(DISTINCT p.id_pedido) AS numero_pedidos,
    COUNT(DISTINCT pi.id_produto) AS numero_produtos,
    SUM(p.valor) AS total_gasto,
    AVG(p.valor) AS media_gasto,
    MAX(p.valor) AS max_gasto,
    MIN(p.valor) AS min_gasto
FROM Clientes c
LEFT JOIN Pedidos p
ON p.id_cliente = c.id_cliente
LEFT JOIN Itens_Pedido pi 
ON p.id_pedido = pi.id_pedido
GROUP BY c.nome
ORDER BY total_gasto DESC;

-- Realize um select que traga o nome da cidade,
-- o produto mais vendido em quantidade, 
-- o total de unidades desse produto vendidas 
--e o valor total faturado com esse produto.

SELECT 
    c.cidade,
    pr.nome AS produto_mais_vendido,
    SUM(i.quantidade) AS total_unidades,
    SUM(i.quantidade * pr.preco) AS valor_total_faturado
FROM Clientes c
JOIN Pedidos p ON c.id_cliente = p.id_cliente
JOIN Itens_Pedido i ON p.id_pedido = i.id_pedido
JOIN Produtos pr ON i.id_produto = pr.id_produto
GROUP BY c.cidade, pr.id_produto, pr.nome
ORDER BY c.cidade, total_unidades DESC;

-- Realize um select que traga o nome do cliente em maiúsculo,
-- cidade 
-- total gasto pelo cliente 
-- média de gastos da cidade daquele cliente

SELECT 
    UPPER(c.nome) AS nome_maiusculo,
    c.cidade AS cidade,
    SUM(p.valor) AS total_gasto,
    (SELECT AVG(p2.valor) 
     FROM Clientes c2 
     JOIN Pedidos p2 ON c2.id_cliente = p2.id_cliente 
     WHERE c2.cidade = c.cidade) AS media_gastos_cidade
FROM Clientes c
LEFT JOIN Pedidos p 
ON c.id_cliente = p.id_cliente
GROUP BY c.nome
ORDER BY total_gasto;



--Realize um select que retorne o nome do produto em minúsculo
--quantos pedidos ele apareceu
--quantidade total vendida
--valor médio gasto quando esse produto foi comprado
--maior e menor valor de pedido que ele apareceu

SELECT
    LOWER(pr.nome) AS nome,
    COUNT(p.id_pedido) AS numero_pedidos,
    SUM(i.quantidade) AS quantidade,
    AVG(p.valor) AS media_valor_pedido,
    MAX(p.valor) AS maior_valor_pedido,
    MIN(p.valor) AS menor_valor_pedido
FROM Produtos pr
LEFT JOIN Itens_Pedido i ON i.id_produto = pr.id_produto
LEFT JOIN Pedidos p ON p.id_pedido = i.id_pedido
GROUP BY pr.nome
ORDER BY quantidade;




SELECT 
    pr.nome AS nome,
    pr.preco AS preco
FROM Produtos pr 
LEFT JOIN Itens_Pedido ip 
ON ip.id_produto = pr.id_produto
LEFT JOIN Pedidos pe 
ON pe.id_pedido =  ip.id_pedido
WHERE pe.id_pedido IS NULL; 

INSERT INTO Produtos (nome, preco) VALUES ('Batata', 10);

SELECT 
    c.nome AS nome,
    c.cidade AS cidade,
    SUM(p.valor) AS total_gasto
FROM Clientes c 
LEFT JOIN Pedidos p
ON p.id_cliente = c.id_cliente
GROUP BY c.nome
ORDER BY total_gasto DESC
LIMIT 3;

SELECT 
    c.nome AS nome,
    c.cidade AS nome,
    COUNT(id_pedido) AS total_pedidos,
    MAX(p.data_pedido) AS data_ultimo,
    MIN(p.data_pedido) AS data_primeiro
FROM Clientes c 
LEFT JOIN Pedidos p
ON p.id_cliente = c.id_cliente
GROUP BY c.nome
ORDER BY total_pedidos DESC
LIMIT 1;

SELECT 
    c.cidade AS cidade,
    c.nome AS cliente,
    MAX(p.valor) AS maior_pedido
FROM Clientes c 
LEFT JOIN Pedidos p 
ON p.id_cliente = c.id_cliente
GROUP BY c.cidade
ORDER BY maior_pedido DESC;


SELECT 
    pr.nome AS nome_produto,
    SUM(ip.quantidade) AS total_vendido,
    c.nome AS cliente
FROM Itens_Pedido ip 
LEFT JOIN Produtos pr
ON ip.id_produto = pr.id_produto
LEFT JOIN Pedidos pe 
ON pe.id_pedido = ip.id_pedido
LEFT JOIN Clientes c 
ON c.id_cliente = pe.id_cliente 
GROUP BY pr.nome;





