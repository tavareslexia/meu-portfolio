const form = document.getElementById("form-produto");
const listaProdutos = document.getElementById("lista-produtos");

async function carregarProdutos() {
  try {
    const res = await axios.get("/produtos");
    const produtos = res.data;

    let html = "<ul>";
    produtos.forEach((p) => {
      html += `<li>${p.nome} - Quantidade: ${p.quantidade}</li>`;
    });
    html += "</ul>";

    listaProdutos.innerHTML = html;
  } catch (err) {
    listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const quantidade = document.getElementById("quantidade").value;
  try {
    const res = await axios.post("/produto", { nome, quantidade });
    alert(res.data);
  } catch (err) {
    alert(err.message);
  }

  carregarProdutos();
});
