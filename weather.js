document.addEventListener("DOMContentLoaded", function() {
    const defaultLat = 14.2766;
    const defaultLon = 121.4167;
    let observer;

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

    function setupObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        observer = new MutationObserver(() => {
            const locationElement = document.getElementById("location");
            const temperatureElement = document.getElementById("temperature");
            const weatherElement = document.getElementById("weather");
            const customImageElement = document.getElementById("custom-image");
            const lastCachedElement = document.getElementById("last-cached");

            if (locationElement && temperatureElement && weatherElement && customImageElement) {
                observer.disconnect(); // Stop observing once elements are found
                initializeWeatherApp();
                monitorElements();
            }
        });

        observer.observe(targetNode, config);
    }

    function monitorElements() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        observer = new MutationObserver(() => {
            const locationElement = document.getElementById("location");
            const temperatureElement = document.getElementById("temperature");
            const weatherElement = document.getElementById("weather");
            const customImageElement = document.getElementById("custom-image");
            const lastCachedElement = document.getElementById("last-cached");

            if (!locationElement || !temperatureElement || !weatherElement || !customImageElement) {
                observer.disconnect(); // Stop observing if any element is missing
                setupObserver(); // Restart checking for elements
            }
        });

        observer.observe(targetNode, config);
    }

    function getWeatherData(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const cacheKey = `weather_${lat}_${lon}`;

        // Fetch country and city name using OpenStreetMap Nominatim API
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(locationData => {
                const city = locationData.address.city || locationData.address.town || locationData.address.village || "Unknown city";
                const country = locationData.address.country || "Unknown country";
                const locationString = `Location: ${city}, ${country}`;
                document.getElementById("location").innerText = locationString;
            })
            .catch(error => console.error('Error fetching the location data:', error));

        // Check if cached data exists and is valid
        const cachedWeather = JSON.parse(localStorage.getItem(cacheKey));
        const currentTime = new Date();
        const midnightToday = new Date();
        midnightToday.setHours(24, 0, 0, 0); // Set to midnight today

        if (cachedWeather && currentTime < midnightToday && Date.now() - cachedWeather.timestamp < 48 * 60 * 60 * 1000) {
            // Use cached data if within valid period
            updateWeatherUI(cachedWeather.data);
            updateLastCachedDate(cachedWeather.timestamp);
        } else {
            // Fetch new weather data
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                .then(response => response.json())
                .then(data => {
                    const weatherData = {
                        timestamp: Date.now(),
                        data: {
                            temperature: data.current_weather.temperature,
                            weather: getWeatherDescription(data.current_weather.weathercode),
                            imageUrl: getWeatherImageUrl(data.current_weather.weathercode)
                        }
                    };

                    // Cache the new weather data
                    localStorage.setItem(cacheKey, JSON.stringify(weatherData));

                    // Update UI with new weather data
                    updateWeatherUI(weatherData.data);
                    updateLastCachedDate(weatherData.timestamp);
                })
                .catch(error => console.error('Error fetching the weather data:', error));
        }
    }

    function updateWeatherUI(weather) {
        const temperatureElement = document.getElementById("temperature");
        const weatherElement = document.getElementById("weather");
        const customImageElement = document.getElementById("custom-image");

        if (temperatureElement) {
            temperatureElement.innerText = `${weather.temperature}°C`;
        }

        if (weatherElement) {
            weatherElement.innerText = `${weather.weather}`;
        }

        if (customImageElement) {
            customImageElement.style.backgroundImage = `url(${weather.imageUrl})`;
        }

        // Optional: Display last cached date if element exists
        const lastCachedElement = document.getElementById("last-cached");
        if (lastCachedElement) {
            const cachedDate = new Date(weather.timestamp);
            lastCachedElement.innerText = `Last cached: ${cachedDate.toLocaleString()}`;
        }
    }

    function updateLastCachedDate(timestamp) {
        const lastCachedElement = document.getElementById("last-cached");
        if (lastCachedElement) {
            const cachedDate = new Date(timestamp);
            lastCachedElement.innerText = `Last cached: ${cachedDate.toLocaleString()}`;
        }
    }

    setupObserver();
});

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
        clear: "/weather/clear.png",
        cloudy: "/weather/cloudy.png",
        fog: "/weather/fog.png",
        drizzle: "/weather/drizzle.png",
        rain: "/weather/rain.png",
        snow: "/weather/snow.png",
        thunderstorm: "/weather/storm.png"
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
