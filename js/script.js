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

// show searched city's current conditions
function currentConditions(city) {
    fetch(apiCity + city + key).then(function (response) {
        // if request was successful
        if (response.ok) {
            response.json().then(function (data) {
                //get coordinates for forecast
                console.log(data);
                lat = data.coord.lat;
                lon = data.coord.lon;
                icon = data.weather[0].icon;
                // run 5day forecast and current conditions
                fiveDayFc(city);
            });
        } else {
            // if request unsuccessful
            savedSearch.shift();
            // send to LS
            localStorage.setItem("cities", JSON.stringify(savedSearch));
            // alert user to failed search
            alert("Sorry, we couldn't find that one. Try another!");
            location.reload();
        }
    });
}
