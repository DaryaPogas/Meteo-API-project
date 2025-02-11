const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const celsiusToggle = document.getElementById("celsius");
const fahrenheitToggle = document.getElementById("fahrenheit");
const apiKey = "9e9d9a6094c4eaceb0415b18c36132ef";

let currentUnit = "metric";

function updateUnitToggle() {
  if (currentUnit === "metric") {
    celsiusToggle.classList.add("active");
    fahrenheitToggle.classList.remove("active");
  } else {
    fahrenheitToggle.classList.add("active");
    celsiusToggle.classList.remove("active");
  }
}

celsiusToggle.addEventListener("click", () => {
  if (currentUnit !== "metric") {
    currentUnit = "metric";
    updateUnitToggle();
    if (card.textContent !== "") {
      const city = document.querySelector(".cityDisplay").textContent;
      fetchAndDisplayWeather(city);
    }
  }
});

fahrenheitToggle.addEventListener("click", () => {
  if (currentUnit !== "imperial") {
    currentUnit = "imperial";
    updateUnitToggle();
    if (card.textContent !== "") {
      const city = document.querySelector(".cityDisplay").textContent;
      fetchAndDisplayWeather(city);
    }
  }
});

async function fetchAndDisplayWeather(city) {
  const weatherData = await getWeather(city, currentUnit);
  displayWeatherInfo(weatherData, currentUnit);
}

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (city) {
    try {
      const weatherData = await getWeather(city, currentUnit);
      displayWeatherInfo(weatherData, currentUnit);
    } catch (error) {
      console.log(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a valid city");
  }
});

async function getWeather(city, unit) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("could not get weather data");
  }
  return await response.json();
}

function displayWeatherInfo(data, unit) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${temp} ${unit === "metric" ? "°C" : "°F"}`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "🌩️";
    case weatherId >= 300 && weatherId < 400:
      return "☔️";
    case weatherId >= 500 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "❄️";
    case weatherId >= 700 && weatherId < 800:
      return "🌫️";
    case weatherId === 800:
      return "☀️";
    case weatherId > 800 && weatherId < 810:
      return "☁️";
    default:
      return "?";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
