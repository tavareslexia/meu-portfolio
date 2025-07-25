// Atribuição das variaveis
const inputNota = document.getElementById("inputNota");
const inputCNH = document.getElementById("inputCNH");
const inputIdade = document.getElementById("inputIdade");
const inputOpcao = document.getElementById("inputOpcao");
const caixa = document.getElementById("mensagem");

// Funções dos botões para pegar os inputs
function pegarNota() {
  document.querySelector(".inputNota").style.display = "flex";
  inputNota.style.display = "block";
  let nota = inputNota.value;
  return nota;
}

function pegarCNH() {
  document.querySelector(".inputElegibilidade").style.display = "flex";
  inputCNH.style.display = "block";
  let cnh = inputCNH.value.toUpperCase();
  return cnh;
}

function pegarIdade() {
  inputIdade.style.display = "block";
  let idade = inputIdade.value;
  return idade;
}

function pegarOpcao() {
  document.querySelector(".inputMenu").style.display = "flex";
  inputOpcao.style.display = "block";
  let opcao = inputOpcao.value.toUpperCase();
  return opcao;
}

//Event listener para startar função de execução após enter

inputNota.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    classificarNota();
    document.querySelector(".inputNota").style.display = "none";
  }
});

inputOpcao.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    verificarOpcao();
    document.querySelector(".inputMenu").style.display = "none";
  }
});

inputCNH.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    verificarElegibilidade();
    document.querySelector(".inputElegibilidade").style.display = "none";
  }
});

//Funções de execução

function exibirResultado(mensagem) {
  document.getElementById("mensagem").textContent = mensagem;
  document.querySelector(".mensagem").style.display = "flex";
}

function verificarElegibilidade(idade, CNH) {
  idade = pegarIdade();
  CNH = pegarCNH() === "SIM";
  let mensagem = "Não pode dirigir";

  if (idade >= 21 && CNH) {
    mensagem = "Pode alugar e dirigir!";
  }

  if (idade >= 18 && CNH) {
    mensagem = "Pode dirigir mas não pode alugar!";
  }
  exibirResultado(mensagem);
}

function classificarNota(nota) {
  nota = pegarNota();
  let mensagem;

  // condição de erro primeiro
  if (nota > 100 || nota < 0) {
    mensagem = "Nota inválida";
    exibirResultado(mensagem);
    return;
  }

  if (nota >= 90) {
    mensagem = "Classificação A! Parabéns :)";
    exibirResultado(mensagem);
    return;
  }
  if (nota >= 80) {
    mensagem = "Classificação B! Parabéns :)";
    exibirResultado(mensagem);
    return;
  }
  if (nota >= 70) {
    mensagem = "Classificação C! :)";
    exibirResultado(mensagem);
    return;
  }
  if (nota >= 60) {
    mensagem = "Classificação D! :( ";
    exibirResultado(mensagem);
    return;
  }
  if (nota < 60) {
    mensagem = "Classificação F! Melhore :(";
    exibirResultado(mensagem);
    return;
  }
}

function verificarOpcao(opcao) {
  opcao = pegarOpcao();

  switch (opcao) {
    case "ARQUIVO":
      exibirResultado("Opção arquivo ativada.");
      break;
    case "EDITAR":
      exibirResultado("Opção editar ativada.");
      break;
    case "VER":
      exibirResultado("Opção ver ativada.");
      break;
    default:
      exibirResultado("Opção inválida.");
  }
}

// retorna quando clica no box de texto

caixa.addEventListener("click", function () {
  document.querySelector(".mensagem").style.display = "none";
  const inputs = document.querySelectorAll("input"); // seleciona todos os inputs
  inputs.forEach((input) => {
    input.value = ""; // Limpa o conteúdo de cada input
  });
});
