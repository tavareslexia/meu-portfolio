// Atribuição das variaveis
const inputNumero = document.getElementById("inputNumero");
const inputArray = document.getElementById("inputArray");
const inputCategoria = document.getElementById("inputCategoria");
const inputNumerosArray = document.getElementById("inputNumerosArray");
const caixa = document.getElementById("mensagem");
let tamanho = 0;
let numeros = [];
let contaNumeros = 1;

// Funções dos botões para pegar os inputs
function pegarNumero() {
  document.querySelector(".inputNumero").style.display = "flex";
  inputNumero.style.display = "block";
  let numero = inputNumero.value;
  return numero;
}

function pegarArray() {
  document.querySelector(".inputArray").style.display = "flex";
  inputArray.style.display = "block";
  let arraySize = inputArray.value;
  return arraySize;
}

function pegarCategoria() {
  document.querySelector(".inputCategoria").style.display = "flex";
  inputCategoria.style.display = "block";
  let categoria = inputCategoria.value.toUpperCase();
  return categoria;
}

//Event listener para startar função de execução após enter

inputNumero.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    gerarTabuada();
    document.querySelector(".inputNumero").style.display = "none";
  }
});

inputCategoria.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    document.querySelector(".inputCategoria").style.display = "none";
    contarCategoria();
  }
});

inputArray.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    pegarNumeros();
  }
});

//Funções de execução

function exibirResultado(mensagem) {
  document.getElementById("mensagem").textContent = mensagem;
  document.querySelector(".mensagem").style.display = "flex";
}

function gerarTabuada(numero) {
  numero = pegarNumero();
  let mensagem = "A tabuada do " + numero + " é: \r\n" ;
  console.log(mensagem);

  for (let contador = 1; contador <= 10; contador++) {
    mensagem = ` ${mensagem}  \r\n ${contador} x ${numero} = ${contador * numero}  `;
  }

  exibirResultado(mensagem);
}

function pegarNumeros() {
  tamanho = pegarArray();
  inputNumerosArray.style.display = "block";
  inputArray.style.display = "none";
}

inputNumerosArray.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    let numero = Number(inputNumerosArray.value);
    numeros.push(numero);

    contaNumeros++;

    if (contaNumeros > tamanho) {
      inputNumerosArray.style.display = "none";
      document.querySelector(".inputArray").style.display = "none";
      procurarMaior();
      return;
    }

    if (contaNumeros <= tamanho) {
      inputNumerosArray.value = "";
      inputNumerosArray.placeholder = `Digite o ${contaNumeros} número:`;
      return;
    } 
  }
});

function procurarMaior() {
  let maior = 0;

  for (const item of numeros) {
    if (item > maior) {
      maior = item;
    }
  }
  exibirResultado("O maior número é: " + maior);

  console.log(numeros);
  console.log(maior);
}

// retorna quando clica no box de texto

caixa.addEventListener("click", function () {
  document.querySelector(".mensagem").style.display = "none";
  const inputs = document.querySelectorAll("input"); // seleciona todos os inputs
  numeros = [];
  contaNumeros = 1;
  inputNumerosArray.placeholder = "Digite o primeiro número:";
  inputs.forEach((input) => {
    input.value = ""; // Limpa o conteúdo de cada input
  });
});
