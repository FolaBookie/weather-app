const WEATHER_API_KEY = "91aa83961bdb15731638dab6ce61e046";

function generateGeocodingEndpoint(city) {
  return `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`;
}

function fetchCityGeocodes(endpoint) {
  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
$("#search-form").on("submit", function (e) {
  e.preventDefault();
  const inputValue = $("#search-input").val();
  const geocodingEndpoint = generateGeocodingEndpoint(inputValue);
  fetchCityGeocodes(geocodingEndpoint);
});

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
