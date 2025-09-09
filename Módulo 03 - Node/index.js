const prompt = require("prompt");
const mainStatesAPI = require("./API_estado");
const mainCalculator = require("./calculadora");
const mainTipCalculator = require("./calculadora_gorjeta");
const mainTemperature = require("./temperatura");

prompt.delimiter = "\n";

prompt.start();

prompt.get(
  {
    properties: {
      operacao: {
        description:
          "Qual operação deseja acessar? \n 01 - API de estados \n 02 - Calculadora \n 03 - Calculadora de gorjeta \n 04 - Conversor de temperatura",
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

    switch (operacao) {
      case "01 - API de estados":
        return mainStatesAPI.mainStatesAPI();
      case "02 - Calculadora":
        return mainCalculator.mainCalculator();
      case "03 - Calculadora de gorjeta":
        return mainTipCalculator.mainTipCalculator();
      case "04 - Conversor de temperatura":
        return mainTemperature.mainTemperature();
      default:
        return "Operação inválida. Use: 01 - API de estados \n 02 - Calculadora \n 03 - Calculadora de gorjeta \n 04 - Conversor de temperatura";
    }
  }
);
