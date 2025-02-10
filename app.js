const btn = document.querySelector("#search");
let cardTitle = document.querySelector(".card-title");
let cardImg = document.querySelector(".card-img-top");
let temp = document.querySelector(".temp");
let feelsLike = document.querySelector(".feels-like");
let description = document.querySelector(".description");
let humidity = document.querySelector(".humidity");
let humidityTitle = document.querySelector(".humidity-title");

btn.addEventListener("click", async () => {
  let city = document.querySelector(".form-control").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  let coordinates = await getCoordinates(city);
  if (!coordinates) {
    console.log("Invalid city name or API issue.");

    temp.innerText = "0°C";
    temp.classList.add("text-danger");
    feelsLike.innerText = "0°C";
    description.innerText = "City not found!";
    description.classList.add("text-danger", "fw-bold");
    humidity.innerHTML = `0% <i class="fas fa-tint ms-1"></i>`;
    humidityTitle.innerText = "Please try again.";
    humidityTitle.classList.add("text-danger", "fw-bold");

    return;
  }

  temp.classList.remove("text-danger");
  description.classList.remove("text-danger", "fw-bold");
  humidityTitle.classList.remove("text-danger", "fw-bold");

  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
  try {
    let weatherReport = await getRes(coordinates.lat, coordinates.lon);
    if (!weatherReport) {
      throw new Error("Failed to fetch weather data.");
    }

    if (weatherReport.temp < 5) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-snowflake fs-1"></i>`;
      cardImg.setAttribute(
        "src",
        "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      );
    } else if (weatherReport.temp >= 5 && weatherReport.temp < 15) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-cloud fs-1"></i>`;
    } else if (weatherReport.temp >= 15 && weatherReport.temp < 25) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-cloud-sun fs-1"></i>`;
    } else if (weatherReport.temp >= 25 && weatherReport.temp < 35) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-sun fs-1"></i>`;
    } else if (weatherReport.temp >= 35) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-fire fs-1"></i>`;
    }

    feelsLike.innerText = `Feels Like ${weatherReport.feelsLike}°C`;
    description.innerHTML = weatherReport.weatherType;
    humidity.innerHTML = `${weatherReport.humidity}% <i class="fas fa-tint ms-1"></i>`;

    document.querySelector(".form-control").value = ""; // Clear input only after success
  } catch (error) {
    console.log(error);
    alert("Failed to fetch weather. Please try again.");
  } finally {
    btn.innerHTML = `<i class="fas fa-search"></i>`;
    document.querySelector(".form-control").focus(); // Focus input field after everything
  }
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
