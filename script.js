const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const status = document.getElementById("status");
const result = document.getElementById("result");

const weatherCodes = {  //data kode cuaca//
  0: "Cerah",
  1: "Cerah berawan",
  2: "Berawan sebagian",
  3: "Mendung",
  45: "Berkabut",
  61: "Hujan ringan",
  63: "Hujan sedang",
  65: "Hujan lebat",
  80: "Hujan lokal",
  95: "Badai petir"
};

function showResult(name, temperature, code) {
  document.getElementById("cityName").textContent = name;
  document.getElementById("temp").textContent = `${temperature}°C`;
  document.getElementById("desc").textContent =
    weatherCodes[code] || "Kondisi tidak diketahui";

  result.classList.remove("hidden");
}

async function getWeather(city) {           //fungsi utama//
  if (!city.trim()) {
    status.textContent = "Isi nama kota dulu.";
    return;
  }

  status.textContent = "Memuat...";
  searchBtn.disabled = true;
  result.classList.add("hidden");

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      status.textContent = "Kota tidak ditemukan.";
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    const { temperature, weathercode } = weatherData.current_weather;
    
      status.textContent = "";
      showResult(name, temperature, weathercode);
      localStorage.setItem("lastCity", name);

  } catch (error) {
    status.textContent = "Gagal mengambil data. Cek koneksi internet.";
  } finally {
    searchBtn.disabled = false;
  }
}


function handleSearch() {
  getWeather(cityInput.value);
}

searchBtn.addEventListener("click", handleSearch);  //event listener//
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

const lastCity = localStorage.getItem("lastCity");
if (lastCity) {
  cityInput.value = lastCity;
  getWeather(lastCity);
}