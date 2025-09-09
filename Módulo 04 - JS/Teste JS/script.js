function gerarElogio() {
  //console.log("Você está indo muito bem nos estudos de JavaScript!");
  let mensagem = "Você está indo muito bem nos estudos de JavaScript!";
  document.getElementById("mensagem").textContent = mensagem;
  document.querySelector(".mensagem").style.display = "flex";
}

function gerarSaudacao(nome = "visitante") {
  //console.log("Olá, " + nome + ".Tenha um ótimo dia.");
  nome = pegarNome();
  let mensagem = "Olá, " + nome + ".Tenha um ótimo dia.";
  document.getElementById("mensagem").textContent = mensagem;
  document.querySelector(".mensagem").style.display = "flex";
  document.getElementById("inputNome").style.display = "none";
  document.querySelector(".inputSaudacao").style.display = "none";
}

function calcularIMC(peso, altura) {
  //console.log("Olá, o seu IMC é de: " + imc);
  peso = pegarPeso();
  altura = pegarAltura();
  let imc = peso / ((altura * altura)/10000);
  let mensagem = "Olá, o seu IMC é de: " + imc;
  document.getElementById("mensagem").textContent = mensagem;
  document.querySelector(".mensagem").style.display = "flex";
  document.getElementById("inputPeso").style.display = "none";
  document.getElementById("inputAltura").style.display = "none";
  document.querySelector(".inputIMC").style.display = "none";
}

function converterTemperatura(temperatura = 0) {
  //console.log("A temperatura em F é de: " + temperaturaFahr);
  temperatura = pegarTemperatura();
  let temperaturaFahr = (temperatura * 9) / 5 + 32;
  let mensagem = "A temperatura em Fahrenheit é de: " + temperaturaFahr;
  document.getElementById("mensagem").textContent = mensagem;
  document.querySelector(".mensagem").style.display = "flex";
  document.getElementById("inputTemperatura").style.display = "none";
  document.querySelector(".inputConversorTemp").style.display = "none";
}

const inputNome = document.getElementById("inputNome");
inputNome.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // tecla trigger
    gerarSaudacao();
  }
});

const inputAltura = document.getElementById("inputAltura");
inputAltura.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // tecla trigger
    calcularIMC();
  }
});

const inputTemperatura = document.getElementById("inputTemperatura");
inputTemperatura.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // tecla trigger
    converterTemperatura();
  }
});



//const somarVersaoCurta = (a, b) => a + b;


function pegarNome() {
  document.querySelector(".inputSaudacao").style.display = "flex";
  document.getElementById("inputNome").style.display = "block";
  let inputNome = document.getElementById("inputNome");
  let nome = inputNome.value;
  return nome;
}

function pegarPeso() {
  document.querySelector(".inputIMC").style.display = "flex";
  document.getElementById("inputPeso").style.display = "block";
  let inputPeso = document.getElementById("inputPeso");
  let peso = inputPeso.value;
  return peso;
}

function pegarAltura() {
  document.getElementById("inputAltura").style.display = "block";
  let inputAltura = document.getElementById("inputAltura");
  let altura = inputAltura.value;
  return altura;
}

function pegarTemperatura() {
  document.querySelector(".inputConversorTemp").style.display = "flex";
  document.getElementById("inputTemperatura").style.display = "block";
  let inputTemperatura = document.getElementById("inputTemperatura");
  let temperatura = inputTemperatura.value;
  return temperatura;
}



const caixa = document.getElementById("mensagem");
caixa.addEventListener("click", function () {
 document.querySelector(".mensagem").style.display = "none";
 const inputs = document.querySelectorAll("input"); // seleciona todos os inputs
  inputs.forEach(input => {
    input.value = undefined; // Limpa o conteúdo de cada input
  });
 
});