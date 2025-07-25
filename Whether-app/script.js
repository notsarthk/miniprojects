// Weather App JavaScript

// API key for OpenWeatherMap - Replace with your actual API key
const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const errorDisplay = document.getElementById('error-display');

// Load last searched city from local storage
window.addEventListener('load', () => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
        searchInput.value = lastCity;
        getWeatherData(lastCity);
    }
});

// Event Listeners
searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
        // Save to local storage
        localStorage.setItem('lastSearchedCity', city);
    } else {
        showError("Please enter a city name");
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Fetch weather data
async function getWeatherData(city) {
    try {
        // Clear previous error
        hideError();
        
        // Show loading state
        currentWeatherSection.innerHTML = '<div class="loading">Loading...</div>';
        forecastSection.innerHTML = '';
        
        // Fetch current weather
        const currentWeatherResponse = await fetch(`${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!currentWeatherResponse.ok) {
            throw new Error('City not found');
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(`${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();
        
        // Update UI
        updateCurrentWeather(currentWeatherData);
        updateForecast(forecastData);
        
    } catch (error) {
        showError(error.message);
        currentWeatherSection.innerHTML = '';
        forecastSection.innerHTML = '';
    }
}

// Update current weather UI
function updateCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const weatherDescription = data.weather[0].description;
    const weatherIcon = getWeatherIcon(data.weather[0].icon);
    const cityName = data.name;
    const country = data.sys.country;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;
    
    currentWeatherSection.innerHTML = `
        <div class="weather-card">
            <div class="weather-icon">
                <i class="${weatherIcon}"></i>
            </div>
            <div class="temperature">${temp}°C</div>
            <div class="description">${weatherDescription}</div>
            <div class="location">${cityName}, ${country}</div>
            <div class="details">
                <div class="detail">
                    <i class="fas fa-temperature-low"></i>
                    <span>Feels like: ${feelsLike}°C</span>
                </div>
                <div class="detail">
                    <i class="fas fa-tint"></i>
                    <span>Humidity: ${humidity}%</span>
                </div>
                <div class="detail">
                    <i class="fas fa-wind"></i>
                    <span>Wind: ${windSpeed} m/s</span>
                </div>
                <div class="detail">
                    <i class="fas fa-compress-alt"></i>
                    <span>Pressure: ${pressure} hPa</span>
                </div>
            </div>
        </div>
    `;
}

// Update forecast UI
function updateForecast(data) {
    // Group forecast by day
    const dailyForecasts = {};
    
    // Process the 3-hour forecasts and group by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!dailyForecasts[day] || date.getHours() === 12) {
            // Prefer noon forecasts for each day
            dailyForecasts[day] = item;
        }
    });
    
    // Create forecast HTML
    let forecastHTML = '<h2>5-Day Forecast</h2><div class="forecast-container">';
    
    // Convert object to array and take only the first 5 days
    Object.values(dailyForecasts).slice(0, 5).forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(item.main.temp);
        const weatherIcon = getWeatherIcon(item.weather[0].icon);
        const description = item.weather[0].description;
        
        forecastHTML += `
            <div class="forecast-item">
                <div class="forecast-day">${day}</div>
                <div class="forecast-icon"><i class="${weatherIcon}"></i></div>
                <div class="forecast-temp">${temp}°C</div>
                <div class="forecast-desc">${description}</div>
            </div>
        `;
    });
    
    forecastHTML += '</div>';
    forecastSection.innerHTML = forecastHTML;
}

// Map OpenWeatherMap icons to Font Awesome icons
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fas fa-sun',           // clear sky day
        '01n': 'fas fa-moon',          // clear sky night
        '02d': 'fas fa-cloud-sun',     // few clouds day
        '02n': 'fas fa-cloud-moon',    // few clouds night
        '03d': 'fas fa-cloud',         // scattered clouds
        '03n': 'fas fa-cloud',         // scattered clouds
        '04d': 'fas fa-cloud',         // broken clouds
        '04n': 'fas fa-cloud',         // broken clouds
        '09d': 'fas fa-cloud-showers-heavy', // shower rain
        '09n': 'fas fa-cloud-showers-heavy', // shower rain
        '10d': 'fas fa-cloud-sun-rain', // rain day
        '10n': 'fas fa-cloud-moon-rain', // rain night
        '11d': 'fas fa-bolt',          // thunderstorm
        '11n': 'fas fa-bolt',          // thunderstorm
        '13d': 'fas fa-snowflake',     // snow
        '13n': 'fas fa-snowflake',     // snow
        '50d': 'fas fa-smog',          // mist
        '50n': 'fas fa-smog'           // mist
    };
    
    return iconMap[iconCode] || 'fas fa-cloud';
}

// Error handling
function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

function hideError() {
    errorDisplay.style.display = 'none';
}