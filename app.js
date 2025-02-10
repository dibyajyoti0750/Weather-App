const btn = document.querySelector("#search");

btn.addEventListener("click", async () => {
  let city = document.querySelector(".form-control").value;
  let coordinates = await getCoordinates(city);
  let weatherReport = await getRes(coordinates.lat, coordinates.lon);
  console.log(weatherReport);
});

async function getRes(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=61e07208cd2f17643d32ebeabf61e4b5`;
  try {
    let res = await axios.get(url);
    let data = {
      country: res.data.sys.country,
      place: res.data.name,
      temp: res.data.main.temp,
      feelsLike: res.data.main.feels_like,
      humidity: res.data.main.humidity,
      weatherType: res.data.weather[0].description,
    };
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getCoordinates(city) {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=61e07208cd2f17643d32ebeabf61e4b5`;
  try {
    let res = await axios.get(url);
    let coordinates = {
      lat: res.data[0].lat,
      lon: res.data[0].lon,
    };
    return coordinates;
  } catch (error) {
    console.log(error);
  }
}
