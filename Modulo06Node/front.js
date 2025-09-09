const form = document.getElementById("form-produto");
const formChange = document.getElementById("form-change-produto");
const formDelete = document.getElementById("form-delete-produto");

let productID = "";

const listaProdutos = document.getElementById("lista-produtos");

async function clickDelete(id) {
  if (confirm("Confirme a exclusão do produto")) {
    try {
      const res = await axios.delete(`/produtos/${id}`);

      alert(res.data);
    } catch (err) {
      alert(err.message);
    }
  }
  carregarProdutos();
}

function clickChange(id, nome, preco) {
  document.querySelector(".mensagem").style.display = "flex";
  productID = id; // salva o ID do produto
  document.getElementById("nomeChange").value = nome;
  document.getElementById("precoChange").value = preco;
}

mensagemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nomeChange").value;
  const preco = document.getElementById("precoChange").value;

  try {
    const res = await axios.patch(`/produtos/${productID}`, {
      nome,
      preco,
    });
    alert(res.data);
    document.querySelector(".mensagem").style.display = "none"; // esconde o form
    carregarProdutos();
  } catch (err) {
    alert(err.message);
  }
});

async function carregarProdutos() {
  try {
    const res = await axios.get("/view-produtos");
    const produtos = res.data;
    console.log(produtos);

    let html = "";
    produtos.forEach((p) => {
      html += `<tr> <td>${p.id} </td>
       <td>${p.nome} </td> 
       <td> R$${p.preco}</td> 
       <td> <button onclick="clickDelete('${p.id}')" type="submit">🗑️</button> <button onclick="clickChange('${p.id}','${p.nome}', '${p.preco}')" type="submit">✏️</button> </td></tr>`;
    });

    listaProdutos.innerHTML = html;
  } catch (err) {
    listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

form.addEventListener("click", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  try {
    const res = await axios.post("/produtos", { nome, preco });
    alert(res.data);
  } catch (err) {
    alert(err.message);
  }

  carregarProdutos();
});

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
});
