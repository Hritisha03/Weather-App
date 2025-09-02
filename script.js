const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("city").value;
  if (city) {
    getCoordinates(city);
  } else {
    weatherInfo.innerHTML = "<p>Please enter a city name!</p>";
  }
});

async function getCoordinates(city) {
  weatherInfo.innerHTML = "<p>⏳ Fetching location...</p>";
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const data = await response.json();

    console.log("Geocoding response:", data); // 👈 Debugging line

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude, name, country } = data.results[0];
    getWeather(latitude, longitude, name, country);
  } catch (error) {
    weatherInfo.innerHTML = `<p>❌ ${error.message}</p>`;
  }
}


async function getWeather(lat, lon, cityName, country) {
  weatherInfo.innerHTML = "<p>⏳ Fetching weather...</p>";
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );
    const data = await response.json();
    showWeather(data, cityName, country);
  } catch (error) {
    weatherInfo.innerHTML = `<p>⚠️ Failed to fetch weather</p>`;
  }
}

function showWeather(data, cityName, country) {
  const current = data.current;
  weatherInfo.innerHTML = `
    <h2>${cityName}, ${country}</h2>
    <p>🌡️ Temperature: ${current.temperature_2m}°C</p>
    <p>💨 Wind Speed: ${current.wind_speed_10m} km/h</p>
    <p>🕒 Time: ${current.time}</p>
  `;
}
