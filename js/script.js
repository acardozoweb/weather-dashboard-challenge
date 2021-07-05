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

// get searched city's current conditions
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
                displayConditions(city);
            });
        } else {
            // if request unsuccessful
            savedSearch.shift();
            // send to LS
            localStorage.setItem("searches", JSON.stringify(savedSearch));
            // alert user to failed search
            alert("Sorry, we couldn't find that one. Try another!");
            location.reload();
        }
    });
}


// show current conditions and 5day forecast
function displayConditions(city) {
    fetch(apiCoord + "&lat=" + lat + "&lon=" + lon + "&units=metric" + key)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        // get weather icon
        icon = data.current.weather[0].icon;
        // get current date
        day = new Date().toLocaleDateString("en-US", {
            timeZone: `${data.timezone}`,
        });

        // populate current weather conditions
        $("#currentCity").html(
            `${city} ${day} <img src='http://openweathermap.org/img/w/${icon}.png'/>`
        );
        // get current temperature
        $("#temp").html(`Temp: ${data.current.temp} Celsius`);
        // get wind
        $("#wind").html(`Wind: ${data.current.wind_speed} KPH`);
        // get humidity
        $("#humidity").html(`Humidity: ${data.current.humidity} %`);
        // get UV index
        $("#uv").html(`UV Index: <span id="uvI">${data.current.uvi}</span>`);
        $("#uvI").css("background-color");
        // clear previopus 5day forecast
        $(".forecastCards").html("");

        // loop data through 5 cards
        for (let i = 1; i < 6; i++) {
            // grab weather icon
            icon = data.daily[i].weather[0].icon;
            // get date in normal format
            day = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US", {
                timeZone: `${data.timezone}`,
              });
            // fill forecast cards
            $(".forecastCards").append(`
            <div class="col-auto mb-3">
            <div class="card text-light cardbg no-gutters" style="width: 14rem;">
                <div class="card-body">
                    <h5 class="card-title">${day}</h5>
                    <p class="card-text my-3 font-weight-bold"><img src='http://openweathermap.org/img/w/${icon}.png'/></p>
                    <p class="card-text my-3 font-weight-bold">Temp: ${data.daily[i].temp.day} Celsius</p>
                    <p class="card-text my-3 font-weight-bold">Wind: ${data.daily[i].wind_speed} KM/hour</p>
                    <p class="card-text my-3 font-weight-bold">Humidity: ${data.daily[i].humidity} %</p>                
                </div>
            </div>`);
        }
    })
}

// // show saved searches from localstorage
// function showSavedSearches() {
//     savedSearch = JSON.parse(localStorage.getItem("searches"));
//     if (savedSearch == null) savedSearch = [];
//     // limit displayed saves
//     if (savedSearch.length > 10) {
//         savedSearch.pop();
//     }
//     // clear list
//     $("#list").html(" ");
//     // create list items / city names
//     for (let i = 0; i < savedSearch.length; i++) {
//         $("#list").append(
//             `<li id="${i}"class="list-group-item text-center font-weight-bold list-group-item-secondary my-2 mt-3">
//             ${savedSearch[i]}
//             </li>`
//         );
//     }
//     // adding event listener to repopulated city name to display corresponding conditions again
//     $(".list-group-item-secondary").on("click", function() {
//         city = $(this).html().trim();
//         currentConditions(city);
//     });
// }

//////// END OF FUNCTIONS ////////




//////// EVENT LISTENERS ////////

// EL on Search button
$("#search-city").on("click", function() {
    // use value entered
    city = $("#city").val();
    // titleCase(city);
    // avoid duplicating saved searches in LS
    if (savedSearch.includes(city)) {
        currentConditions(city);
    } else {
        // save search and show this search's data
        localStorage.setItem("searches", JSON.stringify(savedSearch));
        currentConditions(city);
    }

    

})



// show current city by defauly on page load
$.ajax({
    url: "https://geolocation-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    success: function (location) {
      city = location.city;
      lat = location.latitude;
      lon = location.longitude;
      displayConditions(city);
    }, // if cant find user location
    error: function () {
      currentConditions("Ottawa");
    },
  });