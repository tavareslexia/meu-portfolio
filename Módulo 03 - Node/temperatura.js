const prompt = require("prompt"); // importar o pacote prompt

prompt.delimiter = "\r\n"; // quebra linha

prompt.start(); // inicia o módulo

function mainTemperature() {
  prompt.get(
    {
      properties: {
        temperatura: {
          description: "Digite a temperatura em graus celsius:",
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

      const temperatura = Number(result.temperatura);

      console.log(
        "Temperatura em Fahrenheit:" + converterTemperatura(temperatura)
      );
    }
  );
}
function converterTemperatura(temperatura) {
  return (temperatura * 9) / 5 + 32;
}

module.exports = {
  mainTemperature,
};
