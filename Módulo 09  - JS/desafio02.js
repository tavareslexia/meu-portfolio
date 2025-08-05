// Filtrar produtos eletronicos

const produtos = [
  {
    id: 1,
    nome: 'Camiseta',
    categoria: 'Roupas',
    preco: 59.90,
    estoque: 120
  },
  {
    id: 2,
    nome: 'Calça Jeans',
    categoria: 'Roupas',
    preco: 129.90,
    estoque: 80
  },
  {
    id: 3,
    nome: 'Tênis',
    categoria: 'Calçados',
    preco: 299.90,
    estoque: 50
  },
  {
    id: 4,
    nome: 'Smartphone',
    categoria: 'Eletrônicos',
    preco: 1999.90,
    estoque: 35
  },
  {
    id: 5,
    nome: 'Fone de Ouvido',
    categoria: 'Eletrônicos',
    preco: 149.90,
    estoque: 0
  },
  {
    id: 6,
    nome: 'Relógio',
    categoria: 'Acessórios',
    preco: 499.90,
    estoque: 25
  },
  {
    id: 7,
    nome: 'Televisão',
    categoria: 'Eletrônicos',
    preco: 3499.90,
    estoque: 15
  },
];

const produtosEletronicos = produtos.filter(produto => produto.categoria === 'Eletrônicos');

console.log(produtosEletronicos);

