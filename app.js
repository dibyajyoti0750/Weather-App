const btn = document.querySelector("#search");
let cardTitle = document.querySelector(".card-title");
let temp = document.querySelector(".temp");
let feelsLike = document.querySelector(".feels-like");
let description = document.querySelector(".description");
let humidity = document.querySelector(".humidity");

btn.addEventListener("click", async () => {
  let city = document.querySelector(".form-control").value;
  let coordinates = await getCoordinates(city);

  if (!coordinates) {
    console.log("Invalid city name or API issue.");
    return;
  }

  let weatherReport = await getRes(coordinates.lat, coordinates.lon);

  cardTitle.innerHTML = `Weather <sup class="text-muted fs-6">${weatherReport.country}</sup>`;

  temp.innerText = weatherReport.temp;
  if (weatherReport.temp <= 10) {
    temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-snowflake fs-1 text-primary"></i>`;
  } else if (weatherReport.temp > 10) {
    temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-temperature-arrow-up fs-1 text-danger"></i>`;
  }
  feelsLike.innerText = `Feels Like ${weatherReport.feelsLike}°C`;
  description.innerHTML = weatherReport.weatherType;
  humidity.innerHTML = `${weatherReport.humidity}%<i class="fas fa-tint ms-1"></i>`;
});

async function getRes(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=61e07208cd2f17643d32ebeabf61e4b5`;

  try {
    let res = await axios.get(url);
    return {
      temp: res.data.main.temp,
      feelsLike: res.data.main.feels_like,
      weatherType: res.data.weather[0].description,
      humidity: res.data.main.humidity,
      country: res.data.sys.country,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

async function getCoordinates(city) {
  let url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=61e07208cd2f17643d32ebeabf61e4b5`;

  try {
    let res = await axios.get(url);

    if (!res.data || res.data.length === 0) {
      console.warn("City not found!");
      return null;
    }

    return {
      lat: res.data[0].lat,
      lon: res.data[0].lon,
    };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}
