function calculadora(operacao, num1, num2) {
  switch (operacao) {
    case "soma":
      return num1 + num2;
    case "subtracao":
      return num1 - num2;
    case "multiplicacao":
      return num1 * num2;
    case "divisao":
      if (num2 === 0) {
        return "Erro: divisão por zero não é permitida.";
      }
      return num1 / num2;
    default:
      return "Operação inválida. Use: soma, subtracao, multiplicacao ou divisao.";
  }
}

module.exports = {
  calculadora,
};
