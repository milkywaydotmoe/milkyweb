document.addEventListener("DOMContentLoaded", function() {
    const defaultLat = 14.2766;
    const defaultLon = 121.4167;

    function initializeWeatherApp() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getWeatherData, () => {
                // Use default location if the user denies permission
                getWeatherData({ coords: { latitude: defaultLat, longitude: defaultLon } });
            });
        } else {
            // Use default location if geolocation is not supported
            getWeatherData({ coords: { latitude: defaultLat, longitude: defaultLon } });
            alert("Geolocation is not supported by this browser.");
        }
    }

    function getWeatherData(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://weather.milkyway.moe/weather?lat=${lat}&lon=${lon}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                updateWeatherUI(data);
            })
            .catch(error => console.error('Error fetching the weather data:', error));
    }

    function updateWeatherUI(weatherData) {
        const locationElement = document.getElementById("location");
        const temperatureElement = document.getElementById("temperature");
        const weatherElement = document.getElementById("weather");
        const customImageElement = document.getElementById("custom-image");
        const lastCachedElement = document.getElementById("last-cached");

        if (locationElement) {
            locationElement.innerText = weatherData.location;
        }

        if (temperatureElement) {
            temperatureElement.innerText = weatherData.temperature;
        }

        if (weatherElement) {
            weatherElement.innerText = weatherData.weather;
        }

        if (customImageElement) {
            customImageElement.style.backgroundImage = `url(${weatherData.imageUrl})`;
        }

        if (lastCachedElement) {
            const cachedDate = new Date(weatherData.timestamp);
            lastCachedElement.innerText = `Last cached: ${cachedDate.toLocaleString()}`;
        }
    }

    // Initialize the weather app
    initializeWeatherApp();
});
