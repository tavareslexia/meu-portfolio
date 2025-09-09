// front.js
const apiUrl = "http://localhost:3000/tarefas";
const listaProdutos = document.getElementById("lista-produtos");
const form = document.getElementById("form");
const mensagemForm = document.getElementById("mensagemForm");

// Criar nova tarefa
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const user = document.getElementById("user").value;

  if (!titulo) {
    alert("O título é obrigatório!");
    return;
  }

  try {
    await axios.post(apiUrl, { titulo, descricao, user });
    listarTarefas();
    form.reset();
  } catch (error) {
    console.error(error);
    alert("Erro ao criar tarefa");
  }
});

// Listar tarefas
async function listarTarefas() {
  try {
    const response = await axios.get(apiUrl);
    const container = document.getElementById("lista-produtos");
    container.innerHTML = "";

    response.data.forEach((task) => {
      const card = document.createElement("div");
      card.className = "cards";

      card.innerHTML = `
      <div>
        <div id="${task.tarefa_id}">
        <h3 class="card-title">${task.titulo}</h3>
        <p class="card-desc">${task.descricao}</p>
        </div>
        <p class="user"><strong>Atribuída a: </strong>${task.usuario_nome}</p>
      </div>
      <div class="card-actions">
        <button class="btn-delete" onclick="clickDelete('${task.tarefa_id}')" title="Excluir">X </button>
        <button class="btn-concluir" onclick="clickConcluir('${task.tarefa_id}')" title="Concluir">✔ </button>
      </div>
      `;
      container.appendChild(card);
      if (task.concluida == 1) {
        document.getElementById(task.tarefa_id).style.textDecoration =
          "line-through";
      }
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao listar tarefas");
  }
}

// deletar tarefas
async function clickDelete(id) {
  if (confirm(`Confirme a exclusão da tarefa ID:${id}`)) {
    try {
      const res = await axios.delete(`${apiUrl}/${id}`);

      alert("Tarefa excluída com sucesso.");
    } catch (err) {
      alert(err.message);
    }
  }
  listarTarefas();
}

async function clickConcluir(id) {
  try {
    const res = await axios.patch(`${apiUrl}/${id}`, { status: 1 });
    document.getElementById(id).style.textDecoration = "line-through";

    alert("Tarefa concluída com sucesso.");
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  listarTarefas();
});
