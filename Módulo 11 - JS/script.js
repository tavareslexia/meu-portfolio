//Desafio 01
const tituloPrincipal = document.getElementById("titulo-principal");
const descricao = document.querySelector('.descricao');

tituloPrincipal.textContent ='Bem-vindo ao mundo DOM!';

descricao.style.color = 'purple';

// Desafio 02

const botaoToggle = document.getElementById('btn-toggle');
const caixaAlerta = document.getElementById('caixa-alerta');

botaoToggle.addEventListener('click', () => {
 
  caixaAlerta.classList.toggle('escondido');
});