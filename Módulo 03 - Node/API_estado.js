const axios = require("axios").default;
const prompt = require("prompt"); // importar o pacote prompt
const url_states = "https://brasilapi.com.br/api/ibge/uf/v1";

prompt.delimiter = "\r\n"; // quebra de linha
prompt.start();

async function mainStatesAPI() {
  try {
    const statesResponse = await axios.get(url_states);
    statesResponse.data.forEach((uf) => {
      console.log(`${uf.sigla} - ${uf.nome}`);
    });
    const { state } = await prompt.get({
      properties: {
        state: {
          description: "Digite a sigla do estado desejado:",
          pattern: /^[A-Za-z]+$/, // aceita apenas letras
          message: "Sigla inválida, digite apenas letras.",
          required: true,
        },
      },
    });

    await getCities(state.toUpperCase());
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function getCities(state) {
  try {
    const response = await axios.get(
      `https://brasilapi.com.br/api/ibge/municipios/v1/${state}?providers=dados-abertos-br,gov,wikipedia`
    );
    response.data.forEach((city) => {
      console.log(city.nome);
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  mainStatesAPI,
};
