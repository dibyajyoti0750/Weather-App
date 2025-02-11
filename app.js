const btn = document.querySelector("#search");
let cardTitle = document.querySelector(".card-title");
let cardImg = document.querySelector(".card-img-top");
let temp = document.querySelector(".temp");
let feelsLike = document.querySelector(".feels-like");
let description = document.querySelector(".description");
let weatherType = document.querySelector(".weather-type");
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
  humidityTitle.innerText = "Humidity";

  btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>`;
  try {
    let weatherReport = await getRes(coordinates.lat, coordinates.lon);
    console.log(weatherReport);

    if (!weatherReport) {
      throw new Error("Failed to fetch weather data.");
    }

    if (weatherReport.temp < 5) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-snowflake fs-1 text-primary"></i>`;
      cardImg.setAttribute(
        "src",
        "src/Default_Crisp_winter_landscapes_with_sparkling_snow_and_delica_1_417903bb-dae6-4328-9c5d-0f5a0869fb7b_0.jpg"
      );
    } else if (weatherReport.temp >= 5 && weatherReport.temp < 15) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-cloud fs-1 text-primary"></i>`;
      cardImg.setAttribute(
        "src",
        "src/Default_Misty_mornings_and_gentle_overcast_skies_create_a_calm_1_98164814-246b-417b-91c8-908f88e3f3e6_0.jpg"
      );
    } else if (weatherReport.temp >= 15 && weatherReport.temp < 25) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-cloud-sun fs-1 text-warning"></i>`;
      cardImg.setAttribute(
        "src",
        "src/Default_Lush_greenery_and_blooming_flowers_under_soft_natural_0_926d0685-abe7-4b64-9d02-84807eafd807_0.jpg"
      );
    } else if (weatherReport.temp >= 25 && weatherReport.temp < 35) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-sun fs-1 text-warning"></i>`;
      cardImg.setAttribute(
        "src",
        "src/Default_Sunlit_scenes_bursting_with_vibrant_colors_and_lively_1_55a9d23d-330d-40bb-be4a-b20a56381bd3_0.jpg"
      );
    } else if (weatherReport.temp >= 35) {
      temp.innerHTML = `${weatherReport.temp}°C <i class="fas fa-fire fs-1 text-danger"></i>`;
      cardImg.setAttribute(
        "src",
        "src/Default_Dramatic_sunscorched_vistas_with_shimmering_heat_waves_2_defa25d1-2e90-4d1d-a54d-b94c2f359706_0.jpg"
      );
    }

    if (weatherReport.weatherId >= 200 && weatherReport.weatherId <= 232) {
      // Thunderstorm
      weatherType.setAttribute(
        "class",
        "fas fa-bolt text-warning weather-type"
      );
    } else if (
      weatherReport.weatherId >= 300 &&
      weatherReport.weatherId <= 321
    ) {
      // Drizzle
      weatherType.setAttribute(
        "class",
        "fas fa-cloud-rain text-primary weather-type"
      );
    } else if (
      weatherReport.weatherId >= 500 &&
      weatherReport.weatherId <= 531
    ) {
      // Rain
      weatherType.setAttribute(
        "class",
        "fas fa-cloud-showers-heavy text-primary weather-type"
      );
    } else if (
      weatherReport.weatherId >= 600 &&
      weatherReport.weatherId <= 622
    ) {
      // Snow
      weatherType.setAttribute(
        "class",
        "fas fa-snowflake text-info weather-type"
      );
    } else if (
      weatherReport.weatherId >= 701 &&
      weatherReport.weatherId <= 781
    ) {
      // Atmosphere (Mist, Fog, Smoke, etc.)
      weatherType.setAttribute(
        "class",
        "fas fa-smog text-secondary weather-type"
      );
    } else if (weatherReport.weatherId === 800) {
      // Clear Sky
      weatherType.setAttribute("class", "fas fa-sun text-warning weather-type");
    } else if (weatherReport.weatherId === 801) {
      // Few Clouds
      weatherType.setAttribute(
        "class",
        "fas fa-cloud-sun text-warning weather-type"
      );
    } else if (weatherReport.weatherId === 802) {
      // Scattered Clouds
      weatherType.setAttribute(
        "class",
        "fas fa-cloud text-secondary weather-type"
      );
    } else if (
      weatherReport.weatherId >= 803 &&
      weatherReport.weatherId <= 804
    ) {
      // Broken/Overcast Clouds
      weatherType.setAttribute(
        "class",
        "fas fa-cloud-meatball text-secondary weather-type"
      );
    } else {
      // Default (Unknown Weather)
      weatherType.setAttribute(
        "class",
        "fas fa-question-circle text-muted weather-type"
      );
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
      weatherId: res.data.weather[0].id,
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
