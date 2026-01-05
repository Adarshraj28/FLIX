const weatherLayer = document.getElementById("weather-layer");

function clearWeather() {
  weatherLayer.innerHTML = "";
}

/* ❄️ Snow */
function startSnow() {
  clearWeather();

  for (let i = 0; i < 60; i++) {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.innerText = "❄";

    snow.style.left = Math.random() * 100 + "vw";
    snow.style.animationDuration = 5 + Math.random() * 5 + "s";
    snow.style.fontSize = 8 + Math.random() * 12 + "px";
    snow.style.opacity = Math.random();

    weatherLayer.appendChild(snow);
  }
}

/* 🌧️ Rain */
function startRain() {
  clearWeather();

  for (let i = 0; i < 80; i++) {
    const rain = document.createElement("div");
    rain.className = "raindrop";

    rain.style.left = Math.random() * 100 + "vw";
    rain.style.animationDuration = 0.8 + Math.random() + "s";

    weatherLayer.appendChild(rain);
  }
}

/* Toggle handler */
function applyWeather() {
  const enabled = localStorage.getItem("weather") === "on";
  if (!enabled) {
    clearWeather();
    return;
  }

  startSnow(); // default (can change to rain)
}

applyWeather();
