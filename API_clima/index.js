const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.get("/clima/:cidade", async (req, res) => {
  try {
    const cidade = req.params.cidade;

    const geoRes = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`
    ); // coordenadas da cidade

    if (!geoRes.data.results) {
      return res.status(404).send("Cidade não encontrada"); //status de erro
    }

    const { latitude, longitude, name, country } = geoRes.data.results[0];

    const climaRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    ); //dados do clima

    const temperatura = climaRes.data.current_weather.temperature;

    res.json({
      cidade: name,
      pais: country,
      latitude,
      longitude,
      temperatura: `${temperatura} °C`,
    });
  } catch (erro) {
    console.error(erro);
    res.status(404).send("Erro ao consultar o clima");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
