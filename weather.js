document.addEventListener("DOMContentLoaded", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherData, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function getWeatherData(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("location").innerText = `Location: (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
            document.getElementById("temperature").innerText = `${data.current_weather.temperature}°C`;
            document.getElementById("weather").innerText = `${getWeatherDescription(data.current_weather.weathercode)}`;
            document.getElementById("custom-image").style.backgroundImage = `url(${getWeatherImageUrl(data.current_weather.weathercode)})`;

            // Fetch country and city name using OpenStreetMap Nominatim API
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                .then(response => response.json())
                .then(locationData => {
                    const city = locationData.address.city || locationData.address.town || locationData.address.village || "Unknown city";
                    const country = locationData.address.country || "Unknown country";
                    document.getElementById("location").innerText = `Location: ${city}, ${country}`;
                })
                .catch(error => console.error('Error fetching the location data:', error));
        })
        .catch(error => console.error('Error fetching the weather data:', error));
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function getWeatherDescription(weatherCode) {
    const weatherDescriptions = {
        clear: "Clear sky",
        cloudy: "Cloudy",
        fog: "Fog",
        drizzle: "Drizzle",
        rain: "Rain",
        snow: "Snow",
        thunderstorm: "Thunderstorm"
    };
    const weatherCodeMapping = {
        0: "clear",
        1: "clear",
        2: "cloudy",
        3: "cloudy",
        45: "fog",
        48: "fog",
        51: "drizzle",
        53: "drizzle",
        55: "drizzle",
        56: "drizzle",
        57: "drizzle",
        61: "rain",
        63: "rain",
        65: "rain",
        66: "rain",
        67: "rain",
        71: "snow",
        73: "snow",
        75: "snow",
        77: "snow",
        80: "rain",
        81: "rain",
        82: "rain",
        85: "snow",
        86: "snow",
        95: "thunderstorm",
        96: "thunderstorm",
        99: "thunderstorm"
    };
    return weatherDescriptions[weatherCodeMapping[weatherCode]] || "Unknown weather";
}

function getWeatherImageUrl(weatherCode) {
    const weatherImages = {
        clear:          "/weather/clear.png",
        cloudy:         "/weather/cloudy.png",
        fog:            "/weather/fog.png",
        drizzle:        "/weather/drizzle.png",
        rain:           "/weather/rain.png",
        snow:           "/weather/snow.png",
        thunderstorm:   "/weather/storm.png"
    };
    const weatherCodeMapping = {
        0: "clear",
        1: "clear",
        2: "cloudy",
        3: "cloudy",
        45: "fog",
        48: "fog",
        51: "drizzle",
        53: "drizzle",
        55: "drizzle",
        56: "drizzle",
        57: "drizzle",
        61: "rain",
        63: "rain",
        65: "rain",
        66: "rain",
        67: "rain",
        71: "snow",
        73: "snow",
        75: "snow",
        77: "snow",
        80: "rain",
        81: "rain",
        82: "rain",
        85: "snow",
        86: "snow",
        95: "thunderstorm",
        96: "thunderstorm",
        99: "thunderstorm"
    };
    return weatherImages[weatherCodeMapping[weatherCode]] || "/weather/clear.png";
}
