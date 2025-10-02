const categoryBox = document.getElementById("categoryBox");
const filter = document.getElementById("filterInput");
const carrinho = document.getElementById("carrinho");
const ecommerce = document.getElementById("ecommerce");

function openEcommerce() {
  ecommerce.style.display = "flex";
  ecommerce.style.flexDirection = "column";
  carrinho.style.display = "none";
  carregarCategoriasEProdutos();
}

async function openCart() {
  ecommerce.style.display = "none";
  carrinho.style.display = "flex";
  carrinho.style.flexDirection = "column";

  try {
    const resProdutos = await axios.get("http://localhost:3001/carrinho");
    const produtos = resProdutos.data;
    const quantidadeProdutos = produtos.length;
    let htmlQuantidadeProdutos = `<p>${quantidadeProdutos} itens </p>`;
    let total = 0;
    let htmlCarrinho = "";

    for (const p of produtos) {
      total = total + p.subtotal;
      htmlCarrinho += `
                <div class="productCardCarrinho">
                  <div class="productImageCarrinho"></div>
                  <div class="productInfo">
                    <h3 class="productName">${p.produto}</h3>
                    <p class="productDescription">${p.descricao}</p>
                    <div class="iconsCarrinho">
                        <div class="iconsCarrinho">
                        <div class="quantityBox">
                        <select class="quantityDropDown" onchange="updateCart(${
                          p.id
                        }, ${p.id_produto})" id="quantityDropDown${
        p.id
      }"></select>
                        
                        </div>
                        <button class="filterButton" id ="trashIcon" onclick="clickDelete('${
                          p.id
                        }')" type="button" ><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 21 21"><path fill="none" stroke="#f11010ff" stroke-linecap="round" stroke-linejoin="round" d="M5.5 4.5h10v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm5-2a2 2 0 0 1 1.995 1.85l.005.15h-4a2 2 0 0 1 2-2zm-7 2h14m-9 3v8m4-8v8"/></svg></button>
                        </div>
                      <p class="productPriceCarrinho">R$ ${p.subtotal.toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}</p>
                    </div>
                  </div>
                </div>
              `;
    }

    const htmlTotal = `<h2 id="subTotalCarrinho"> Total: </h2> <p> R$ ${total.toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} </p> `;

    document.getElementById("quantidadeProdutos").innerHTML =
      htmlQuantidadeProdutos;

    document.getElementById("carrinhoCardContainer").innerHTML = htmlCarrinho;

    document.getElementById("totalCarrinho").innerHTML = htmlTotal;

    for (const p of produtos) {
      const resQuantidadeCarrinho = await axios.get(
        `http://localhost:3001/carrinho/${p.id}`
      );
      const quantidadeCarrinho = resQuantidadeCarrinho.data.quantidade;

      const select = document.getElementById(`quantityDropDown${p.id}`);

      p.estoque_disponivel = p.estoque_disponivel + quantidadeCarrinho;

      let limit = p.estoque_disponivel;
      // > 10 ? 10 : p.estoque_disponivel;

      for (let i = 1; i <= limit; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;

        // seleciona a quantidade atual
        if (i === p.quantidade) {
          option.selected = true;
        }

        select.appendChild(option);
      }
    }
  } catch (err) {
    console.log("Nenhum produto no carrinho.");
  }
}

async function addToCart(id_produto, quantidade = 1) {
  try {
    const resProdutos = await axios.get("http://localhost:3001/carrinho");
    const produtos = resProdutos.data;

    const resEstoque = await axios.get(
      `http://localhost:3001/produtos/${id_produto}`
    );
    let nome = resEstoque.data.nome;
    let estoque = resEstoque.data.estoque;
    let descricao = resEstoque.data.descricao;
    let status = resEstoque.data.status;
    let preco = resEstoque.data.preco;
    let id_categoria = resEstoque.data.id_categoria;

    const novoEstoque = estoque - 1;

    res = await axios.patch(`http://localhost:3001/produtos/${id_produto}`, {
      nome: nome,
      descricao: descricao,
      status: status,
      preco: preco,
      estoque: novoEstoque,
      id_categoria: id_categoria,
    });

    const itemExistente = produtos.find(
      (item) => item.id_produto == id_produto
    );

    if (itemExistente) {
      const novaQuantidade = itemExistente.quantidade + quantidade;

      res = await axios.patch(
        `http://localhost:3001/carrinho/${itemExistente.id}`,
        {
          id_produto,
          quantidade: novaQuantidade,
        }
      );
      document.getElementById("cartCount").innerText = `${produtos.length}`;
    } else {
      res = await axios.post("http://localhost:3001/carrinho", {
        id_produto,
        quantidade,
      });
      document.getElementById("cartCount").innerText = `${produtos.length + 1}`;
    }
    carregarCategoriasEProdutos();
    animateCartCount();

    return;
  } catch (err) {
    alert(err.message);
  }
}

async function carregarCategoriasEProdutos() {
  try {
    const resCategoria = await axios.get("http://localhost:3001/categorias");
    const categorias = resCategoria.data;

    const resProdutos = await axios.get("http://localhost:3001/carrinho");
    const produtosCarrinho = resProdutos.data;

    let htmlCategorias = "";

    for (const c of categorias) {
      if (c.status === 1) {
        try {
          const resProduto = await axios.get(
            `http://localhost:3001/produtos/category/${c.id}`
          );

          const produtos = resProduto.data.filter((p) => p.status === 1);

          let produtosText = produtos.length > 1 ? "produtos" : "produto";

          if (produtos.length > 0) {
            htmlCategorias += `<div class="categoryBlock">
            <hr></hr>
                                  <h2 class="categoryName">${c.nome}</h2>
                                  <p class="productDescription" id="productsNumber">${produtos.length} ${produtosText}</p>
                                  <div class="productsGrid">`;

            produtos.forEach((p) => {
              if (p.estoque > 0) {
                htmlCategorias += `
                <div class="productCard">
                  <div class="productImage"></div>
                  <div class="productInfo">
                    <h3 class="productName">${p.nome}</h3>
                    <p class="productDescription">${p.descricao}</p>
                    <p class="productPrice">R$ ${p.preco.toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                  </div>
                  <input type="button" class="createButton" id ="addToCartButton" onclick="addToCart('${
                    p.id_produto
                  }')" value="Adicionar ao Carrinho" ></input> 
                </div>
              `;
              }
              if (p.estoque <= 0) {
                htmlCategorias += `
                <div class="productCard">
                  <div class="productImage"></div>
                  <div class="productInfo">
                  <h3 class="productName">${p.nome}</h3>
                  <p class="productDescription">${p.descricao}</p>
                    <div class = "productNotAvailable">
                    <p class="productPrice">R$ ${p.preco.toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                    <p class="outOfStock"> Sem Estoque </p>
                    </div>
                  </div>
                  <button type="button"  class="notAvailableButton" id ="notAvailableButton"> Indisponível </button> 
              
                </div>
              `;
              }
            });

            htmlCategorias += `</div></div>`;
          }
        } catch (err) {
          console.log(`Nenhum produto encontrado para a categoria ${c.nome}`);
        }
      }
    }
    categoryBox.innerHTML = htmlCategorias;
    document.getElementById(
      "cartCount"
    ).innerText = `${produtosCarrinho.length}`;
  } catch (err) {
    console.error("Erro ao carregar categorias e produtos:", err);
    categoryBox.innerHTML = "<p>Erro ao carregar categorias e produtos.</p>";
  }
}

async function filterProducts(name) {
  try {
    const resProductsFiltered = await axios.get(
      `http://localhost:3001/produtos/filter/${name}`
    );
    const products = resProductsFiltered.data;

    const categorias = [];
    let htmlCategorias = "";

    for (const p of products) {
      if (p.status === 1) {
        if (!categorias.includes(p.categoria)) {
          categorias.push(p.categoria);
        }
      }
    }

    for (const c of categorias) {
      const produtosDaCategoria = products.filter(
        (p) => p.categoria === c && p.status === 1
      );

      htmlCategorias += `
        <div class="categoryBlock">
          <h2 class="categoryName">${c}</h2>
          <p class="productDescription" id="productsNumber">${produtosDaCategoria.length} produtos</p>
          <div class="productsGrid">
      `;

      for (const p of produtosDaCategoria) {
        if (p.estoque > 0) {
          htmlCategorias += `
          <div class="productCard">
                  <div class="productImage"></div>
                  <div class="productInfo">
                    <h3 class="productName">${p.nome}</h3>
                    <p class="productDescription">${p.descricao}</p>
                    <p class="productPrice">R$ ${p.preco.toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                  </div>
                  <button type="button"  class="createButton" id ="addToCartButton" onclick="addToCart('${
                    p.id_produto
                  }')" > Adicionar ao Carrinho</button> 
                </div>
        `;
        } else {
          htmlCategorias += `
                <div class="productCard">
                  <div class="productImage"></div>
                  <div class="productInfo">
                  <h3 class="productName">${p.nome}</h3>
                  <p class="productDescription">${p.descricao}</p>
                    <div class = "productNotAvailable">
                    <p class="productPrice">R$ ${p.preco.toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                    <p class="outOfStock"> Sem Estoque </p>
                    </div>
                  </div>
                  <button type="button" class="notAvailableButton" id ="notAvailableButton"> Indisponível </button> 
              
                </div>
              `;
        }
      }

      htmlCategorias += `
          </div>
        </div>
      `;
    }

    categoryBox.innerHTML = htmlCategorias;
  } catch (err) {
    console.error("Erro ao carregar categorias e produtos:", err);
    categoryBox.innerHTML = `<p class="pEcommerce">Nenhhum produto encontrado.</p>`;
  }
}

async function clickDelete(id) {
  const resProdutos = await axios.get("http://localhost:3001/carrinho");
  const produtos = resProdutos.data;

  try {
    const resItem = await axios.get(`http://localhost:3001/carrinho/${id}`);

    const resEstoque = await axios.get(
      `http://localhost:3001/produtos/${resItem.data.id_produto}`
    );
    let nome = resEstoque.data.nome;
    let estoque = resEstoque.data.estoque;
    let descricao = resEstoque.data.descricao;
    let status = resEstoque.data.status;
    let preco = resEstoque.data.preco;
    let id_categoria = resEstoque.data.id_categoria;

    const novoEstoque = estoque + resItem.data.quantidade;

    resUpdate = await axios.patch(
      `http://localhost:3001/produtos/${resItem.data.id_produto}`,
      {
        nome: nome,
        descricao: descricao,
        status: status,
        preco: preco,
        estoque: novoEstoque,
        id_categoria: id_categoria,
      }
    );

    const res = await axios.delete(`http://localhost:3001/carrinho/${id}`);

    document.getElementById("cartCount").innerText = `${produtos.length - 1}`;
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
  }

  openCart();
}

async function updateCart(id, id_produto) {
  quantidade = Number(document.getElementById(`quantityDropDown${id}`).value);

  try {
    const resItemCarrinho = await axios.get(
      `http://localhost:3001/carrinho/${id}`
    );
    const quantidadeAtual = Number(resItemCarrinho.data.quantidade);

    const diferenca = Number(quantidadeAtual - quantidade);

    const resEstoque = await axios.get(
      `http://localhost:3001/produtos/${resItemCarrinho.data.id_produto}`
    );
    let nome = resEstoque.data.nome;
    let estoque = resEstoque.data.estoque;
    let descricao = resEstoque.data.descricao;
    let status = resEstoque.data.status;
    let preco = resEstoque.data.preco;
    let id_categoria = resEstoque.data.id_categoria;

    const novoEstoque = estoque + diferenca;

    console.log(`${diferenca} = ${quantidadeAtual} - ${quantidade}`);
    console.log(`${novoEstoque} = ${estoque} + ${diferenca}`);

    resUpdate = await axios.patch(
      `http://localhost:3001/produtos/${resItemCarrinho.data.id_produto}`,
      {
        nome: nome,
        descricao: descricao,
        status: status,
        preco: preco,
        estoque: novoEstoque,
        id_categoria: id_categoria,
      }
    );

    const res = await axios.patch(`http://localhost:3001/carrinho/${id}`, {
      id_produto,
      quantidade,
    });
    openCart();
  } catch (err) {
    alert(err.message);
  }
}

async function createOrder() {
  const container = document.getElementById("pedidoCriado");
  const mensagem = document.getElementById("mensagemSucessoPedidoCriado");
  const mensagemErro = document.getElementById("mensagemErroPedidoCriado");

  try {
    const res = await axios.post("http://localhost:3001/pedidos");

    document.getElementById("cartCount").innerText = `0`;

    if (res.status === 200) {
      container.style.display = "flex";
      mensagem.style.display = "flex";

      setTimeout(() => {
        container.style.display = "none";
        mensagem.style.display = "none";
      }, 1000);
    } else {
      throw new Error("Erro ao criar pedido.");
    }
  } catch (err) {
    container.style.display = "flex";
    mensagemErro.innerHTML =
      err.response?.data?.message || err.message || "Erro inesperado";
    mensagemErro.style.display = "flex";

    setTimeout(() => {
      container.style.display = "none";
      mensagemErro.style.display = "none";
    }, 3000);
  }

  openCart();
}

async function updateQuantity(id_produto, quantidade) {
  try {
    const resProdutos = await axios.get(
      `http://localhost:3001/produtos/${id_produto}`
    );

    const produto = resProdutos.data;

    const novoEstoque = produto.estoque - quantidade;

    const res = await axios.patch(
      `http://localhost:3001/produtos/${id_produto}`,
      {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        estoque: novoEstoque,
        status: produto.status,
        id_categoria: produto.id_categoria,
      }
    );
  } catch (err) {
    alert(err.message);
  }
}

function animateCartCount() {
  const cartCount = document.getElementById("cartCount");
  cartCount.classList.add("shake");

  setTimeout(() => {
    cartCount.classList.remove("shake");
  }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCategoriasEProdutos();
  loadCategories();
});

filter.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const search = filter.value;

    if (!search) {
      carregarCategoriasEProdutos();
    } else {
      filterProducts(search);
    }
  }
});

//backoffice

function setActiveButton(buttonId) {
  // Remove active de todos os botões
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Adiciona active ao botão clicado
  document.getElementById(buttonId).classList.add("active");
}

async function loadCategories() {
  setActiveButton("categoriesButton");
  document.getElementById("products").style.display = "none";
  document.getElementById("orders").style.display = "none";
  document.getElementById("categories").style.display = "flex";
  document.getElementById("categories").style.flexDirection = "column";

  try {
    const res = await axios.get("http://localhost:3001/categorias");
    const categorias = res.data;

    let html = "";
    categorias.forEach((c) => {
      if (c.status === 1) {
        html += `<tr> <td>${c.id} </td>
       <td>${c.nome} </td> 
       <td class="visivel"> Visível </td> 
       <td> <button onclick="openEditCategoryModal(${c.id},'${c.nome}', 1)" type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="#504f4fff" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="#504f4fff" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.19 2.19 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.91.91 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg></button> </td></tr>`;
      } else {
        html += `<tr> <td>${c.id} </td>
       <td>${c.nome} </td> 
       <td class="invisivel"> Invisível </td> 
       <td> <button onclick="openEditCategoryModal(${c.id},'${c.nome}', 0)" type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="#504f4fff" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="#504f4fff" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.19 2.19 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.91.91 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg></button> </td></tr>`;
      }
    });
    document.getElementById("listaCategorias").innerHTML = html;
  } catch (err) {
    document.getElementById("listaCategorias").innerHTML =
      "<p>Erro ao carregar produtos.</p>";
  }
}

async function loadProducts() {
  setActiveButton("productsButton");
  document.getElementById("categories").style.display = "none";
  document.getElementById("orders").style.display = "none";
  document.getElementById("products").style.display = "flex";
  document.getElementById("products").style.flexDirection = "column";

  try {
    const res = await axios.get("http://localhost:3001/produtos");
    const produtos = res.data;
    let html = "";
    produtos.forEach((p) => {
      if (p.status === 1) {
        html += `<tr> <td>${p.id_produto} </td>
       <td>${p.nome} </td> 
       <td> ${p.descricao}</td>
       <td> ${p.categoria}</td>
       <td> R$${p.preco.toLocaleString("pt-BR", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
       })}</td>
       <td>${p.estoque}</td>
       <td class="visivel"> Visível </td> 
       <td> <button onclick="openEditProductModal(${p.id_produto}, '${
          p.nome
        }','${p.descricao}', ${p.estoque},'${p.categoria}', ${
          p.preco
        }, 1)" type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="#504f4fff" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="#504f4fff" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.19 2.19 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.91.91 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"></svg></button> </td></tr>`;
      } else {
        html += `<tr> <td>${p.id_produto} </td>
       <td>${p.nome} </td> 
       <td> ${p.descricao}</td>
       <td> ${p.categoria}</td>
       <td> R$${p.preco.toLocaleString("pt-BR", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
       })}</td>
       <td>${p.estoque}</td>
       <td class="invisivel"> Invisível </td> 
       <td> <button onclick="openEditProductModal('${p.id_produto}', '${
          p.nome
        }', '${p.descricao}', ${p.estoque},'${p.categoria}', ${
          p.preco
        }, 0)" type="submit"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="#504f4fff" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="#504f4fff" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.19 2.19 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.91.91 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"></svg></button> </td></tr>`;
      }
    });
    document.getElementById("listaProdutos").innerHTML = html;
  } catch (err) {
    document.getElementById("listaProdutos").innerHTML =
      "<p>Erro ao carregar produtos.</p>";
  }
}

async function getOrders() {
  try {
    const res = await axios.get("http://localhost:3001/pedidos");
    const pedidos = res.data;

    loadOrders(pedidos);
  } catch (err) {
    document.getElementById("listaPedidos").innerHTML =
      "<p>Erro ao carregar produtos.</p>";
  }
}

async function loadOrders(pedidos) {
  setActiveButton("ordersButton");
  document.getElementById("categories").style.display = "none";
  document.getElementById("products").style.display = "none";
  document.getElementById("orders").style.display = "flex";
  document.getElementById("orders").style.flexDirection = "column";

  let html = "";
  pedidos.forEach((p) => {
    html += `<tr> <td>${p.id} </td>
       <td>${new Intl.DateTimeFormat("pt-BR").format(
         new Date(p.data + " " + p.hora)
       )} - ${p.hora}</td> 
       <td>${p.quantidade_itens}</td>
       <td>R$${p.valor_total.toLocaleString("pt-BR", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
       })}</td>
       <td> <button onclick="loadOrderDetails(${
         p.id
       })" type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 7 16"><path fill="#000000" d="M1.5 13a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71L5.3 7.99L1.15 3.85c-.2-.2-.2-.51 0-.71c.2-.2.51-.2.71 0l4.49 4.51c.2.2.2.51 0 .71l-4.5 4.49c-.1.1-.23.15-.35.15Z"/></svg><w/button> </td></tr>`;
  });
  document.getElementById("listaPedidos").innerHTML = html;
}

function showFilter() {
  document.getElementById("filterBox").style.display = "flex";
}

function cleanFilter() {
  document.getElementById("inputInitialDate").value = "";
  document.getElementById("inputFinalDate").value = "";
  document.getElementById("inputLowestValue").value = "";
  document.getElementById("inputHighestValue").value = "";

  getOrders();
}

document.getElementById("mensagem").addEventListener("click", function () {
  document.querySelector(".mensagem").style.display = "none";
  const inputs = document.querySelectorAll("input"); // seleciona todos os inputs
  inputs.forEach((input) => {
    input.value = undefined; // Limpa o conteúdo de cada input
  });
});

function newCategory() {
  document.getElementById("mensagemNovaCategoria").style.display = "flex";
  document.getElementById("boxMensagemCategoria").style.display = "flex";

  document.getElementById("statusNewCategory").innerHTML =
    "<p>Status: invisível</p>";
}

function newProduct() {
  loadProductCategories();
  document.getElementById("mensagemNovoProduto").style.display = "flex";
  document.getElementById("boxMensagemNovoProduto").style.display = "flex";

  document.getElementById("statusNewProduct").innerHTML =
    "<p>Status: invisível</p>";
}

async function loadProductCategories() {
  const select = document.getElementById("categoriaNovoProduto");
  select.innerHTML = '<option value="">Selecione a categoria</option>'; // limpa antes

  try {
    const res = await axios.get("http://localhost:3001/categorias");
    const categorias = res.data;

    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id; // ou cat.nome se preferir
      option.textContent = cat.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
  }
}

function checkToggleStatus(id) {
  const toggle = document.getElementById(`checkboxEditCategory${id}`);

  if (toggle.checked == true) {
    document.getElementById("statusEditCategory").innerHTML =
      "<p>Status: visível</p>";
  } else {
    document.getElementById("statusEditCategory").innerHTML =
      "<p>Status: invisível</p>";
  }
}

function checkProductToggleStatus(id) {
  const toggle = document.getElementById(`checkboxEditProduct${id}`);

  if (toggle.checked == true) {
    document.getElementById("statusEditProduct").innerHTML =
      "<p>Status: visível</p>";
  } else {
    document.getElementById("statusEditProduct").innerHTML =
      "<p>Status: invisível</p>";
  }
}

function checkCategoryStatus() {
  const toggle = document.getElementById("checkboxNewCategory");

  if (toggle.checked == true) {
    document.getElementById("statusNewCategory").innerHTML =
      "<p>Status: visível</p>";
  } else {
    document.getElementById("statusNewCategory").innerHTML =
      "<p>Status: invisível</p>";
  }
}

function checkProductStatus() {
  const toggle = document.getElementById("checkboxNewProduct");

  if (toggle.checked == true) {
    document.getElementById("statusNewProduct").innerHTML =
      "<p>Status: visível</p>";
  } else {
    document.getElementById("statusNewProduct").innerHTML =
      "<p>Status: invisível</p>";
  }
}

function closeNewCategory() {
  document.getElementById("mensagemNovaCategoria").style.display = "none";
  document.getElementById("boxMensagemCategoria").style.display = "none";
}

function closeNewProduct() {
  document.getElementById("mensagemNovoProduto").style.display = "none";
  document.getElementById("boxMensagemNovoProduto").style.display = "none";
  document.getElementById("nomeNovoProduto").value = "";
  document.getElementById("descricaoNovoProduto").value = "";
  document.getElementById("precoNovoProduto").value = "";
  document.getElementById("estoqueNovoProduto").value = "";
  document.getElementById("categoriaNovoProduto").value = "";
  toggle.checked = false;
}

async function createCategory() {
  const nome = document.getElementById("nomeNovaCategoria").value;
  const toggle = document.getElementById("checkboxNewCategory");

  const container = document.getElementById("categoriaCriada");
  const mensagem = document.getElementById("mensagemSucessoNovaCategoria");
  const mensagemErro = document.getElementById("mensagemErroNovaCategoria");

  const status = toggle.checked ? 1 : 0;

  // esconde tudo antes
  container.style.display = "none";
  mensagem.style.display = "none";
  mensagemErro.style.display = "none";

  try {
    const res = await axios.post("http://localhost:3001/categorias", {
      nome,
      status,
    });

    if (res.status === 200 || res.status === 201) {
      // mostra container e mensagem de sucesso
      container.style.display = "flex";
      mensagem.style.display = "flex";

      setTimeout(() => {
        container.style.display = "none";
        mensagem.style.display = "none";
      }, 1000);

      loadCategories();
    } else {
      throw new Error("Erro ao criar categoria");
    }
    document.getElementById("nomeNovaCategoria").value = "";
  } catch (err) {
    // mostra container e mensagem de erro
    container.style.display = "flex";
    mensagemErro.innerHTML =
      err.response?.data?.message || err.message || "Erro inesperado";
    mensagemErro.style.display = "flex";

    setTimeout(() => {
      container.style.display = "none";
      mensagemErro.style.display = "none";
    }, 1000);
  }

  toggle.checked = false;
  loadCategories();
}

async function createNewProduct() {
  const nome = document.getElementById("nomeNovoProduto").value;
  const descricao = document.getElementById("descricaoNovoProduto").value;
  const preco = reverterMascara(
    document.getElementById("precoNovoProduto").value
  );
  const estoque = document.getElementById("estoqueNovoProduto").value;
  const id_categoria = document.getElementById("categoriaNovoProduto").value;

  const toggle = document.getElementById("checkboxNewProduct");

  const container = document.getElementById("produtoCriado");
  const mensagem = document.getElementById("mensagemSucessoNovoProduto");
  const mensagemErro = document.getElementById("mensagemErroNovoProduto");

  const status = toggle.checked ? 1 : 0;

  container.style.display = "none";
  mensagem.style.display = "none";
  mensagemErro.style.display = "none";

  try {
    const res = await axios.post("http://localhost:3001/produtos", {
      nome,
      descricao,
      preco,
      estoque,
      status,
      id_categoria,
    });

    if (res.status === 200 || res.status === 201) {
      // mostra container e mensagem de sucesso
      container.style.display = "flex";
      mensagem.style.display = "flex";

      setTimeout(() => {
        container.style.display = "none";
        mensagem.style.display = "none";
      }, 1000);

      loadProducts();
    } else {
      throw new Error("Erro ao criar categoria");
    }

    document.getElementById("nomeNovoProduto").value = "";
    document.getElementById("descricaoNovoProduto").value = "";
    document.getElementById("precoNovoProduto").value = "";
    document.getElementById("estoqueNovoProduto").value = "";
    document.getElementById("categoriaNovoProduto").value = "";
    toggle.checked = false;
  } catch (err) {
    // mostra container e mensagem de erro
    container.style.display = "flex";
    mensagemErro.innerHTML =
      err.response?.data?.message || err.message || "Erro inesperado";
    mensagemErro.style.display = "flex";

    setTimeout(() => {
      container.style.display = "none";
      mensagemErro.style.display = "none";
    }, 1000);
  }
  loadProducts();
}

function openEditCategoryModal(id, name, status) {
  const toggleStatus = Number(status) === 1 ? "checked" : "";

  document.getElementById("mensagemAlterarCategoria").innerHTML = `
     <div class="headerCategories">
                <h3>Editar Categoria</h3>
                <button onclick="closeEditCategoryModal() "><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                        viewBox="0 0 256 256">
                        <path fill="#000000"
                            d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
                    </svg></button>
            </div>
            <p>Nome:</p>
            <input type="text" id="nomeEditCategoria${id}" value="${name}">
            <div class="toggle">
                <div id="statusEditCategory"> </div>
                <label class="switch">
                    <input type="checkbox" id="checkboxEditCategory${id}" onclick="checkToggleStatus(${id})" ${toggleStatus}>
                    <span class="slider round"></span>
                </label>
            </div>
            <button class="createButton" id="editCategoryButton" onclick="editCategory(${id},'${name}')">Editar
                Categoria</button>
  `;
  checkToggleStatus(id);
  document.getElementById("boxMensagemAlterarCategoria").style.display = "flex";
  document.getElementById("mensagemAlterarCategoria").style.display = "flex";
}

function closeEditCategoryModal() {
  document.getElementById("boxMensagemAlterarCategoria").style.display = "none";
  document.getElementById("mensagemAlterarCategoria").style.display = "none";
}

async function editCategory(id) {
  nome = document.getElementById(`nomeEditCategoria${id}`).value;
  toggle = document.getElementById(`checkboxEditCategory${id}`);
  statusAtual = toggle.checked ? 1 : 0;

  const container = document.getElementById("categoriaEditada");
  const mensagem = document.getElementById("mensagemSucessoCategoriaEditada");
  const mensagemErro = document.getElementById("mensagemErroCategoriaEditada");

  try {
    const res = await axios.patch(`http://localhost:3001/categorias/${id}`, {
      nome: nome,
      status: statusAtual,
    });

    if (res.status === 200) {
      container.style.display = "flex";
      mensagem.innerHTML = `<h3>${res.data.message}</h3>`;
      mensagem.style.display = "flex";

      setTimeout(() => {
        container.style.display = "none";
        mensagem.style.display = "none";
      }, 1000);

      loadCategories();
    } else {
      throw new Error("Erro ao editar categoria");
    }
  } catch (err) {
    container.style.display = "flex";
    mensagemErro.innerHTML =
      err.response?.data?.message || err.message || "Erro inesperado";
    mensagemErro.style.display = "flex";

    setTimeout(() => {
      container.style.display = "none";
      mensagemErro.style.display = "none";
    }, 3000);
  }

  loadCategories();
}

async function openEditProductModal(
  id,
  nome,
  descricao,
  estoque,
  categoria,
  preco,
  status
) {
  const toggleStatus = Number(status) === 1 ? "checked" : "";

  document.getElementById("mensagemAlterarProduto").innerHTML = `
     <div class="headerCategories">
                <h3>Editar Produto</h3>
                <button onclick="closeEditProductModal()"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                        viewBox="0 0 256 256">
                        <path fill="#000000"
                            d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
                    </svg></button>
            </div>
            <p>Nome:</p>
            <input type="text" id="nomeEditarProduto${id}" value="${nome}">
            <p>Descrição:</p>
            <input type="text" id="descricaoEditarProduto${id}" value="${descricao}">
            <p>Categoria:</p>
            <select class="quantityDropDown" id="categoriaEditarProduto${id}">
                <option value="">Selecione a categoria</option>
            </select>
            <p>Preço:</p>
            <input type="text" id="precoEditarProduto${id}" value="${preco}" oninput="mascaraMoeda(event)">
            <p>Estoque:</p>
            <input type="number" id="estoqueEditarProduto${id}" value="${estoque}">
            <div class="toggle">
                <div id="statusEditProduct"> </div>
                <label class="switch">
                    <input type="checkbox" id="checkboxEditProduct${id}" onclick="checkProductToggleStatus(${id})" ${toggleStatus}>
                    <span class="slider round"></span>
                </label>
            </div>
            <button class="createButton" id="editProductButton" onclick="editProduct(${id})">Editar
                Produto</button>

        </div>
  `;

  await loadEditProductCategories(id, categoria);
  checkProductToggleStatus(id);
  document.getElementById("boxMensagemAlterarProduto").style.display = "flex";
  document.getElementById("mensagemAlterarProduto").style.display = "flex";
}

function closeEditProductModal() {
  document.getElementById("boxMensagemAlterarProduto").style.display = "none";
  document.getElementById("mensagemAlterarProduto").style.display = "none";
}

async function loadEditProductCategories(produtoId, categoriaAtual) {
  const select = document.getElementById(`categoriaEditarProduto${produtoId}`);
  select.innerHTML = '<option value="">Selecione a categoria</option>'; // limpa antes

  console.log(categoriaAtual);

  try {
    const res = await axios.get("http://localhost:3001/categorias");
    const categorias = res.data;

    console.log(categorias);
    categorias.forEach((cat) => {
      // apenas ativas
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nome;

      // marca a categoria atual como selecionada
      if (cat.nome === categoriaAtual) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
  }
}

async function editProduct(id) {
  const toggle = document.getElementById(`checkboxEditProduct${id}`);
  const statusAtual = toggle.checked ? 1 : 0;

  const nome = document.getElementById(`nomeEditarProduto${id}`).value;
  const descricao = document.getElementById(
    `descricaoEditarProduto${id}`
  ).value;
  const preco = reverterMascara(
    document.getElementById(`precoEditarProduto${id}`).value
  );
  const estoque = document.getElementById(`estoqueEditarProduto${id}`).value;
  const categoria = document.getElementById(
    `categoriaEditarProduto${id}`
  ).value;

  const container = document.getElementById("produtoEditado");
  const mensagem = document.getElementById("mensagemSucessoProdutoEditado");
  const mensagemErro = document.getElementById("mensagemErroProdutoEditado");

  try {
    const res = await axios.patch(`http://localhost:3001/produtos/${id}`, {
      nome: nome,
      descricao: descricao,
      status: statusAtual,
      preco: preco,
      estoque: estoque,
      id_categoria: categoria,
    });

    if (res.status === 200 || res.status === 201) {
      // mostra container e mensagem de sucesso
      container.style.display = "flex";
      mensagem.style.display = "flex";

      setTimeout(() => {
        container.style.display = "none";
        mensagem.style.display = "none";
      }, 1000);

      loadProducts();
    } else {
      throw new Error("Erro ao criar categoria");
    }
  } catch (err) {
    // mostra container e mensagem de erro
    container.style.display = "flex";
    mensagemErro.innerHTML =
      err.response?.data?.message || err.message || "Erro inesperado";
    mensagemErro.style.display = "flex";

    setTimeout(() => {
      container.style.display = "none";
      mensagemErro.style.display = "none";
    }, 3000);
  }
  loadProducts();
}

async function loadOrderDetails(id) {
  try {
    const resOrderDetails = await axios.get(
      `http://localhost:3001/pedidos/${id}`
    );
    const orderDetails = resOrderDetails.data;

    const resItensDetails = await axios.get(
      `http://localhost:3001/itens/order/${id}`
    );

    const itensDetails = resItensDetails.data.result;

    console.log(itensDetails);

    console.log(orderDetails);

    let htmlOrderDetails = `
    <div class="headerCategories">
      <h3>Detalhes do Pedido #${orderDetails.id}</h3>
      <button onclick="closeOrderDetailsModal() "><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                        viewBox="0 0 256 256">
                        <path fill="#000000"
                            d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
                    </svg></button>
    </div>
      <div class="infoPedido">
          <div class="boxInfoPedido">
            <p class="textoInfoPedido">Data e Hora<br></p><p>${new Intl.DateTimeFormat(
              "pt-BR"
            ).format(
              new Date(orderDetails.data + " " + orderDetails.hora)
            )} - ${orderDetails.hora}</p>
          </div>
          <div class="boxInfoPedido">
            <p class="textoInfoPedido">Qtde de Itens<br></p><p>${
              orderDetails.quantidade_itens
            }</p>
          </div>
          <div class="boxInfoPedido">
            <p class="textoInfoPedido">Valor Total<br></p><p>R$ ${Number(
              orderDetails.valor_total
            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </div>
      </div>

      <h4>Produtos</h4>
      <table class="tabelaProdutos">
          <thead>
              <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unitário</th>
                  <th>Subtotal</th>
              </tr>
          </thead>
          <tbody id="listaProdutos">

    `;
    if (itensDetails && itensDetails.length > 0) {
      itensDetails.forEach((item) => {
        htmlOrderDetails += `
          <tr>
            <td>${item.produto}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${Number(item.preco_unitario ?? 0).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}</td>
            <td>R$ ${Number(
              item.subtotal ?? item.quantidade * (item.preco_unitario ?? 0)
            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        `;
      });
    } else {
      htmlOrderDetails += `
        <tr>
          <td colspan="4" style="text-align:center;">Nenhum item encontrado</td>
        </tr>
      `;
    }

    htmlOrderDetails += `
          </tbody>
      </table>
    `;

    const mensagemDetalhes = document.getElementById("mensagemDetalhesPedido");
    mensagemDetalhes.innerHTML = htmlOrderDetails;
    mensagemDetalhes.style.display = "flex";
    document.getElementById("detalhesPedido").style.display = "flex";
  } catch (err) {
    console.error("Erro ao carregar categorias e produtos:", err);
  }
}

function closeOrderDetailsModal() {
  document.getElementById("mensagemDetalhesPedido").style.display = "none";
  document.getElementById("detalhesPedido").style.display = "none";
}

async function applyFilter() {
  const dataInicial = document.getElementById("inputInitialDate").value;
  const dataFinal = document.getElementById("inputFinalDate").value;
  const valorMinimo = reverterMascara(
    document.getElementById("inputLowestValue").value
  );
  const valorMaximo = reverterMascara(
    document.getElementById("inputHighestValue").value
  );
  console.log(dataInicial, dataFinal, valorMinimo, valorMaximo);
  try {
    const res = await axios.get("http://localhost:3001/pedidos/filter", {
      params: { dataInicial, dataFinal, valorMinimo, valorMaximo },
    });

    const pedidos = res.data;
    loadOrders(pedidos);
  } catch (error) {
    console.error("Erro ao aplicar filtros:", error);
  }
}

function mascaraMoeda(event) {
  const input = event.target;
  let value = input.value.replace(/\D/g, "");

  value = value.padStart(3, "0");

  const digitsFloat = value.slice(0, -2) + "." + value.slice(-2);

  input.value = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(digitsFloat);
}

function reverterMascara(preco) {
  let numeroPreco = preco
    .replaceAll(".", "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  return numeroPreco;
}
