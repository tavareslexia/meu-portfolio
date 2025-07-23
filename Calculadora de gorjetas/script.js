const button = document.getElementById("button")
const inputTotal = document.getElementById("total");
const inputTip = document.getElementById("tip_percentage");
const result = document.getElementById("result");
const box = document.querySelector(".result");
const caixa = document.getElementById("result");

button.addEventListener("click", function(){

    total = Number(inputTotal.value);
    tip = Number(inputTip.value);

    const totalTip = total * (tip/100);
    const totalGeneral = total  + totalTip; 

    const message = `Tip: R$${totalTip.toFixed(2)}. Total to pay: R$${totalGeneral.toFixed(2)}.`;

    result.textContent = message;

    result.style.display = "flex";
    box.style.display = "flex";

})


caixa.addEventListener("click", function () {
 document.querySelector(".result").style.display = "none";
 const inputs = document.querySelectorAll("input"); // seleciona todos os inputs
  inputs.forEach(input => {
    input.value = undefined; // Limpa o conteúdo de cada input
  });
 
});