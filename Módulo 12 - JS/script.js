let APIstate = "https://brasilapi.com.br/api/ibge/uf/v1";

let stateSelect = document.querySelector(".UF");
let citySelect = document.querySelector(".city");
let startButton = document.querySelector("#startButton");
let checktButton = document.querySelector("#checkButton");
const spinner = document.getElementById("spinner");
const errorBox = document.getElementById("mensagem");

let textLatitude = document.querySelector("#latitude");
let textLongitude = document.querySelector("#longitude");
let textWind = document.querySelector("#wind");
let textTemperature = document.querySelector("#temperature");
let textWeather = document.querySelector("#weather_status");
let textCountryState = document.querySelector("#country_state");
let textCity = document.querySelector("#city_name");
let homePageImage = document.querySelector("#image"); //melhorar nome

let returnButton = document.querySelector(".menu-back"); //melhorar nome

const weatherCodeDescriptions = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog with frost",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Moderate showers",
  82: "Violent showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorms",
  96: "Thunderstorms with light hail",
  99: "Thunderstorms with heavy hail",
};

//Ir para segunda tela
startButton.addEventListener("click", function (event) {
  document.querySelector(".home_page").style.display = "none";
  document.querySelector(".check_weather").style.display = "flex";
});

//Ir para terceira tela
checktButton.addEventListener("click", function (event) {
  document.querySelector(".home_page").style.display = "none";
  document.querySelector(".check_weather").style.display = "none";
  showSpinner();
});

//Voltar para segunda tela
returnButton.addEventListener("click", function (event) {
  document.querySelector(".check_weather").style.display = "flex";
  document.querySelector(".weather_page").style.display = "none";
});

// Formatar string
function formatString(name) {
  return name
    .toLowerCase() // deixa tudo em minúsculas
    .split(" ") // separa por espaços
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "); // junta de volta com espaço
}

// Pegar lista dos estados do Brasil
function loadStates() {
  fetch(APIstate)
    .then((res) => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
    .then((data) => {
      data.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")); // ordem alfabetica
      data.forEach((state) => {
        let option = document.createElement("option");
        option.value = state.sigla;
        option.textContent = state.nome;
        stateSelect.append(option);
      });
    })
    .catch((erro) => {
      console.error("Erro:", erro);
    });
}

stateSelect.addEventListener("change", () => {
  citySelect.innerHTML =
    "<option selected disabled>Selecione a cidade</option>"; // Limpa antes de carregar
  loadCities();
});

// Pegar lista de cidades do estado escolhido

function loadCities() {
  const regexParenteses = /\(([^)]+)\)/g; //regex para pegar tudo que está entre ()
  const selectedState = stateSelect.value;

  fetch(
    `https://brasilapi.com.br/api/ibge/municipios/v1/${selectedState}?providers=dados-abertos-br,gov,wikipedia`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
    .then((data) => {
      data.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")); //ordem alfabetica
      data.forEach((city) => {
        let option = document.createElement("option");
        option.value = formatString(
          city.nome.replaceAll(regexParenteses, "").trim()
        );
        option.textContent = formatString(
          city.nome.replaceAll(regexParenteses, "").trim()
        );
        citySelect.append(option);
      });
    })
    .catch((erro) => {
      console.error("Erro:", erro); //exibir erro na tela
    });
}

//Pegar latitude e longitude da cidade escolhida

function loadCoordinates() {
  const selectedState = stateSelect.options[stateSelect.selectedIndex].text; // Retorna a sigla da UF, não o nome
  const selectedCity = citySelect.value.replaceAll("-", " ");

  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${selectedCity}&country_code=BR&language=pt`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        throw new Error("Cidade não encontrada");
      }

      const result = data.results.find(
        (r) =>
          r.admin1.toLowerCase() === selectedState.toLowerCase() &&
          (!r.admin2 ||
            r.admin2
              .replaceAll("-", " ")
              .toLowerCase()
              .includes(selectedCity.replaceAll("-", " ").toLowerCase()))
      );

      if (!result) {
        hideSpinnerError();
        // showError("Correspondência estado e cidade não encontrada");
        return;
      }

      const latitude = result.latitude;
      const longitude = result.longitude;

      textLatitude.textContent = latitude.toFixed(2);
      textLongitude.textContent = longitude.toFixed(2);

      textCity.textContent = selectedCity;
      textCountryState.textContent = selectedState;

      getWeather(latitude, longitude);
    })
    .catch((erro) => {
      console.error("Erro:", erro.message);
    });
}

function getWeather(latitude, longitude) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
    .then((data) => {
      const temperature = data.current_weather.temperature;
      const weatherCode = data.current_weather.weathercode;
      const isDay = data.current_weather.is_day;
      const wind = data.current_weather.windspeed;

      fillWeatherPage(temperature, weatherCode, isDay, wind);
    })

    .catch((erro) => {
      console.error("Erro:", erro);
    });
}

function getWeatherImageName(weatherCode, isDay) {
  const timePrefix = isDay ? "Day" : "Night";

  if ([0, 1].includes(weatherCode)) {
    return `${timePrefix}_sun.png`; // Sol
  } else if ([2, 3].includes(weatherCode)) {
    return `${timePrefix}_clouds.png`; // Nuvens
  } else if ([45, 48].includes(weatherCode)) {
    return `${timePrefix}_moon.png`; // Nevoeiro ou lua (alternativo)
  } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return `${timePrefix}_wind.png`; // Garoa / vento
  } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return `${timePrefix}_rain.png`; // Chuva
  } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return `${timePrefix}_snow.png`; // Neve
  } else if ([95, 96, 99].includes(weatherCode)) {
    return `${timePrefix}_storm.png`; // Tempestade
  } else {
    return `${timePrefix}_clouds.png`; // padrão
  }
}

function fillWeatherPage(temperature, weatherCode, isDay, wind) {
  textTemperature.textContent = temperature + " °C";
  textWeather.textContent =
    weatherCodeDescriptions[weatherCode] || "Clima desconhecido";
  textWind.textContent = wind + " km/h";

  // Atualiza a imagem
  const imageName = getWeatherImageName(weatherCode, isDay);
  homePageImage.src = `images/${imageName}`;
  hideSpinner();
}

function showSpinner() {
  spinner.style.display = "block";
}

function hideSpinner() {
  spinner.style.display = "none";
  document.querySelector(".weather_page").style.display = "flex";
}

function hideSpinnerError() {
  spinner.style.display = "none";
  document.querySelector(".mensagem").style.display = "flex";
}

errorBox.addEventListener("click", function () {
  document.querySelector(".mensagem").style.display = "none";
  document.querySelector(".check_weather").style.display = "flex";
});

document.addEventListener("DOMContentLoaded", loadStates);
