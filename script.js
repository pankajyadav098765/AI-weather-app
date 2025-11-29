const API_KEY = '578f6107f18da6401bdf45590ebabd73';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');

// Event Listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

// Get Weather Data
async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    searchBtn.textContent = 'Loading...';
    hideError();

    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('City not found');
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError('City not found. Try: London, Delhi, Tokyo');
    } finally {
        searchBtn.textContent = 'Search';
    }
}

// Display Weather
function displayWeather(data) {
    const { name, sys, main, weather, wind } = data;
    
    locationElement.textContent = `${name}, ${sys.country}`;
    temperatureElement.textContent = `${Math.round(main.temp)}°C`;
    descriptionElement.textContent = weather[0].description;
    humidityElement.textContent = `${main.humidity}%`;
    windElement.textContent = `${wind.speed} m/s`;

    // Update AI with new data
    if (window.weatherAI) {
        window.weatherAI.updateWeatherData(data);
    }
}

// Error Handling
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError() {
    document.getElementById('error-message').style.display = 'none';
}

// Auto-load London weather
window.addEventListener('load', () => {
    getWeather();
});