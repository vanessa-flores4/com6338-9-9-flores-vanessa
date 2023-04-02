const weatherApp = document.getElementById("weather-app");
const weather = document.getElementById("weather");
const searchLocation = document.getElementById("weather-search");
const inputEl = document.querySelector("input");
const form = document.querySelector("form");
const lineBreak = document.createElement("br");
const div = document.createElement("div");
const weatherAPIKey = "f75423644d329812f146960de698918d";

form.onsubmit = async function (e) {
    e.preventDefault();
    weather.prepend(div);
    const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
    let search = this.search.value.trim();
    const fetchURL = `${weatherURL}${search}&units=imperial&appid=${weatherAPIKey}`;
    if (!search || searchLocation.value === "") {
        search = "";
        weather.innerHTML = ''
    }
    try {
        const res = await fetch(fetchURL);
        if (res.status !== 200) {
        throw new Error("Location Not Found");
        }
        const data = await res.json();
        process(data);
    } catch (err) {
        div.innerHTML = err.message;
    }
    this.search.value = "";
};

process = async (data) => {
    div.innerHTML = "";
    weather.innerHTML = "";
    const { coord: { lat, lon }, 
        name, 
        sys: { country }, 
        weather: [{ icon, description }], 
        main: { temp, feels_like }, 
        dt
    } = data;

    const locationSearched = document.createElement("h2");
    div.appendChild(locationSearched);
    locationSearched.textContent = data.name + " , " + data.sys.country

    const viewMapLink = document.createElement("a");
    const mapURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    viewMapLink.href = mapURL;
    viewMapLink.target = "_blank";
    viewMapLink.textContent = "Click to View Map";
    div.appendChild(viewMapLink);
    div.appendChild(lineBreak)

    const displayedImg = document.createElement("img");
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    displayedImg.src = iconURL;
    displayedImg.alt = description;
    div.appendChild(displayedImg);

    const weatherDescr = document.createElement("p");
    weatherDescr.textContent = description;
    div.appendChild(weatherDescr);

    const currentTemp = document.createElement("p");
    currentTemp.textContent = `Current: ${temp}° F`;
    div.appendChild(currentTemp);

    const feelsLikeTemp = document.createElement("p");
    feelsLikeTemp.textContent = `Feels like: ${feels_like}° F`;
    div.appendChild(feelsLikeTemp);

    const lastUpdate = document.createElement("p");
    const date = new Date(dt * 1000);
    const timeString = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
    lastUpdate.textContent = `Last updated: ${timeString}`;
    div.appendChild(lastUpdate);
    weather.appendChild(div);
};