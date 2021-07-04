// my openweather api key
const key = "&appid=7f412d4278c03b3c06e49f9a1ebebf0b";
// openweather link to current city conditions
const apiCity = "https://api.openweathermap.org/data/2.5/weather/?q=";
// use coordinates to get 5-day forecast
const apiCoord = "https://api.openweathermap.org/data/2.5/onecall?";

let savedSearch = [];
let lat, lon, city, day, icon;

// search form
const form = document.getElementById("form");

//////// FUNCTIONS ////////

function currentConditions(city) {
  fetch(
    "https:/api.openweathermap.org/data/2.5/weather/?q=" +
      city +
      "&appid=" +
      key
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(data);
      lat = data.coord.lat;
      lon = data.coord.lon;
      icon = data.weather[0].icon;
      day = new Date(data.dt * 1000).toLocaleDateString("en-US");
      $(".card-group").html(" ");
      fiveDayFc();
    });
}

function fiveDayFc() {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat + "&lat=" + lon + "&exclude=current,minutely,hourly&units=metric&appid=" + key)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });

  $("#currentCity").html(
    `${city} ${day} <img src='http://openweathermap.org/img/w/${icon}.png'/>`
  );
  $("#temp").html(`Temp: ${data.daily[0].temp.day} Celsius`);
  $("#wind").html(`Wind: ${data.daily[0].wind_speed} KM/hour`);
  $("#humidity").html(`humidity: ${data.daily[0].humidity} %`);
  $("#uv").html(`uv: ${data.daily[0].uvi} C`);
  for (let i = 1; i < 6; i++) {
    //show weather icon
    icon = data.daily[i].weather[0].icon;
    // get normal date format
    day = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US", {
      timeZone: `${data.timeZone}`,
    });
    // populate forecast cards
    $(".forecastCards").append(`
            <div class = "col-auto mb-3">
            <div class = "card text-light cardbg no-gutters" style = "width: 14rem;">
                <div class = "card-body">
                    <h5 class = "card-title">${day}</h5>
                    <p class = "card-text font-weight-bold"> <img src = 'http://openweathermap.org/img/w/${icon}.png'/></p>
                    <p class = "card-text font-weight-bold> Temp: {data.daily[i].temp.day} Celsius </p>
                    <p class = "card-text font-weight-bold">Wind: ${data.daily[i].wind_speed} KM/hour </p>
                    <p class = "card-text font-weight-bold">Humidity: ${data.daily[i].humidity} % </p> 
                </div>
            </div>`);
  }
}
