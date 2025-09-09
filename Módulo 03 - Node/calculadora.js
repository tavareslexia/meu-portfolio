const prompt = require("prompt"); // importar o pacote prompt

prompt.delimiter = "\r\n"; // quebra linha

prompt.start(); // inicia o módulo

function mainCalculator() {
  prompt.get(
    {
      properties: {
        operacao: {
          description: "Qual operação deseja realizar?",
        },
        num1: {
          description: "Digite o primeiro número:",
          pattern: /^\d+$/, // Regular expression that input must be valid against.
          message: "Por favor, digite um número.",
          required: true,
        },
        num2: {
          description: "Digite o segundo número:",
          pattern: /^\d+$/, // Regular expression that input must be valid against.
          message: "Por favor, digite um número.",
          required: true,
        },
      },
    },

    (err, result) => {
      if (err) {
        console.error("Erro ao ler os dados:", err);
        return;
      }
      const operacao = result.operacao;
      const num1 = Number(result.num1);
      const num2 = Number(result.num2);

      console.log("Resultado da operação:" + calculadora(operacao, num1, num2));
    }
  );
}

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
  mainCalculator,
};
