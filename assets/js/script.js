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
    const h3Element = $("#card-title").text(
      `${geocodingData.name}(${dayjs().format("MMMM D, YYYY")})`
    );
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
  console.log(weatherData);
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
  weatherForecast.forEach(function (data, index) {
    if (index === 0) {
      displayCurrentConditions(data);
    } else {
      displayFutureConditions(data);
    }
  });
}

function displayCurrentConditions(currentConditions) {
  const iconUrl = `https://openweathermap.org/img/wn/${currentConditions.weather[0].icon}.png`;
  console.log(currentConditions);
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
  const listElement = $("<ul>");
  searchHistory.forEach((city) => {
    const listItem = $("<li>").text(city);
    listElement.append(listItem);
  });
  historyList.append(listElement);
}

$("#search-form").on("submit", async function (e) {
  e.preventDefault();
  const inputValue = $("#search-input").val();
  const geocodingEndpoint = generateGeocodingEndpoint(inputValue);
  const geocodingData = await fetchCityGeocodes(geocodingEndpoint);
  console.log(geocodingData);
  await fetchWeatherForecast(geocodingData.lat, geocodingData.lon);
  updateSearchHistory(geocodingData.name);
  displaySearchHistory();
});

displaySearchHistory();
// Create a weather dashboard with form inputs.
// When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
// When a user views the current weather conditions for that city they are presented with:
// The city name
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// The wind speed
// When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// When a user click on a city in the search history they are again presented with current and future conditions for that city
