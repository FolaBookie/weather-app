const WEATHER_API_KEY = "91aa83961bdb15731638dab6ce61e046";

function generateGeocodingEndpoint(city) {
  return `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`;
}

function generateForecastEndpoint(lat, long) {
  return `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=${WEATHER_API_KEY}`;
}

async function fetchCityGeocodes(endpoint) {
  let geocodingData;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    geocodingData = data[0];
  } catch (error) {
    geocodingData = null;
  }
  return geocodingData;
}

async function fetchWeatherForecast(lat, long) {
  const endpoint = generateForecastEndpoint(lat, long);
  let weatherData;
  try {
    const response = await fetch(endpoint);
    weatherData = await response.json();
  } catch (error) {
    weatherData = null;
  }
  const weatherForecast = [];
  const weatherForecastDays = [];
  weatherData.list.forEach(function (data) {
    const day = data.dt_txt.split(" ")[0];
    if (!weatherForecastDays.includes(day)) {
      weatherForecast.push(data);
      weatherForecastDays.push(day);
    }
  });
  const forecast = $("#forecast");
  forecast.empty();
  $("#forecast-heading").removeClass("hide");
  weatherForecast.forEach(function (data, index) {
    if (index === 0) {
      displayCurrentConditions(data, weatherData.city.name);
    } else {
      displayFutureConditions(data);
    }
  });
}

function displayCurrentConditions(currentConditions, city) {
  $("#today").removeClass("hide");
  const iconUrl = `https://openweathermap.org/img/wn/${currentConditions.weather[0].icon}.png`;
  const h3Element = $("#card-title").text(
    `${city}(${dayjs(currentConditions.dt_txt).format("MMMM D, YYYY")})`
  );
  const icon = $("#icon").attr("src", iconUrl);
  const temperature = $("#temp").html(
    `Temperature: ${currentConditions.main.temp} &deg;C`
  );
  const wind = $("#wind").text(`Wind: ${currentConditions.wind.speed} KPH`);
  const humidity = $("#humidity").text(
    `Humidity: ${currentConditions.main.humidity}%`
  );
}

function displayFutureConditions(futureConditions) {
  const forecast = $("#forecast");
  const card = $("<div>").addClass("card");
  const cardBody = $("<div>").addClass("card-body");
  const cardTitle = $("<h3>")
    .addClass("card-Title")
    .text(dayjs(futureConditions.dt_txt).format("MMMM D, YYYY"));
  const iconUrl = `https://openweathermap.org/img/wn/${futureConditions.weather[0].icon}.png`;
  const icon = $("<img>").attr("src", iconUrl);
  const temperature = $("<p>").html(
    `Temperature: ${futureConditions.main.temp} &deg;C`
  );
  const wind = $("<p>").text(`Wind: ${futureConditions.wind.speed} KPH`);
  const humidity = $("<p>").text(
    `Humidity: ${futureConditions.main.humidity}%`
  );
  cardBody.append(cardTitle, icon, temperature, wind, humidity);
  card.append(cardBody);
  forecast.append(card);
}

// Function to update the search history
function updateSearchHistory(city) {
  const searchHistory = JSON.parse(localStorage.getItem("history")) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("history", JSON.stringify(searchHistory));
  }
}

// Function to display search history
function displaySearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem("history")) || [];
  const historyList = $("#history");
  historyList.empty();
  searchHistory.forEach((city) => {
    const button = $("<button>").text(city);
    button.on("click", function () {
      getCityWeatherData(city);
    });
    historyList.append(button);
  });
}

async function getCityWeatherData(city) {
  const geocodingEndpoint = generateGeocodingEndpoint(city);
  const geocodingData = await fetchCityGeocodes(geocodingEndpoint);
  await fetchWeatherForecast(geocodingData.lat, geocodingData.lon);
  updateSearchHistory(geocodingData.name);
  displaySearchHistory();
}

$("#search-form").on("submit", async function (e) {
  e.preventDefault();
  const inputValue = $("#search-input").val();
  if (!inputValue.trim()) {
    return;
  }
  getCityWeatherData(inputValue);
});

displaySearchHistory();
