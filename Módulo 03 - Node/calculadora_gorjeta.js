const prompt = require("prompt"); // importar o pacote prompt

prompt.delimiter = "\r\n"; // quebra linha

prompt.start(); // inicia o módulo

function mainTipCalculator() {
  prompt.get(
    {
      properties: {
        total: {
          description: "Qual o valor total da conta?",
          pattern: /^\d+$/, // Regular expression that input must be valid against.
          message: "Por favor, digite um número.",
          required: true,
        },
        gorjeta: {
          description: "Quanto deseja dar de gorjeta em porcentagem?",
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

      const total = Number(result.total);
      const gorjeta = Number(result.gorjeta);

      console.log("Valor total da conta:" + calcular(total, gorjeta));
    }
  );
}
function calcular(total, gorjeta) {
  return total + total * (gorjeta / 100);
}

module.exports = {
  mainTipCalculator,
};
