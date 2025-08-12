//Desafio 01
const tituloPrincipal = document.getElementById("titulo-principal");
const descricao = document.querySelector('.descricao');

tituloPrincipal.textContent ='Bem-vindo ao mundo DOM!';

descricao.style.color = 'purple';

// Desafio 02

const botaoToggle = document.getElementById('btn-toggle');
const caixaAlerta = document.getElementById('caixa-alerta');

botaoToggle.addEventListener('click', () => {
  caixaAlerta.classList.toggle('escondido'); // manipula as classes CSS

});

// Deasaio 03

const input = document.getElementById("input-tarefa");
const botaoAdicionar = document.getElementById("btn-adicionar");
const tarefas = document.getElementById("lista-tarefas");

botaoAdicionar.addEventListener('click',()=>{
 const textoTarefa = input.value.trim(); // trim remove espaços extras

  // b. Verifica se o campo não está vazio
  if (textoTarefa !== '') {

    const novaTarefa = document.createElement('li');
    novaTarefa.textContent = textoTarefa;
    tarefas.append(novaTarefa);

    input.value = '';
  }

})