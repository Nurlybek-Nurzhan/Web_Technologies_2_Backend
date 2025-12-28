/**
 * Frontend JavaScript
 *
 * Handles communication with our Express server (NOT directly with external APIs!)
 * This demonstrates server-side API integration pattern.
 *
 * APIs used:
 * 1. OpenWeather (Core) - Weather data
 * 2. Mediastack (Additional #1) - News
 * 3. REST Countries (Additional #2) - Country info
 */

// ===========================================
// DOM Elements
// ===========================================
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const weatherSection = document.getElementById("weather-section");
const countrySection = document.getElementById("country-section");
const newsSection = document.getElementById("news-section");

// ===========================================
// Event Listeners
// ===========================================

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  await fetchAllData(city);
});

// ===========================================
// Main Data Fetching
// ===========================================

/**
 * Fetches data from all 3 APIs through our server
 */
async function fetchAllData(city) {
  showLoading();
  hideError();
  hideAllSections();

  try {
    // Step 1: Fetch weather first (we need country_code from response)
    const weatherData = await fetchWeather(city);
    displayWeather(weatherData);

    // Step 2: Use country_code to fetch country info and news in parallel
    const countryCode = weatherData.country_code;

    const [countryData, newsData] = await Promise.all([
      fetchCountry(countryCode),
      fetchNews(countryCode, city),
    ]);

    displayCountry(countryData);
    displayNews(newsData);
  } catch (error) {
    showError(error.message || "Failed to fetch data. Please try again.");
  } finally {
    hideLoading();
  }
}

// ===========================================
// API Fetch Functions (calls to OUR server)
// ===========================================

/**
 * Fetch weather from /api/weather
 */
async function fetchWeather(city) {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch weather");
  }

  return data;
}

/**
 * Fetch country info from /api/country
 */
async function fetchCountry(countryCode) {
  const response = await fetch(
    `/api/country?code=${encodeURIComponent(countryCode)}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch country info");
  }

  return data;
}

/**
 * Fetch news from /api/news
 */
async function fetchNews(countryCode, city) {
  const response = await fetch(
    `/api/news?country=${encodeURIComponent(
      countryCode
    )}&keywords=${encodeURIComponent(city)}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch news");
  }

  return data;
}

// ===========================================
// Display Functions
// ===========================================

/**
 * Display weather data
 */
function displayWeather(data) {
  document.getElementById("temperature").textContent = Math.round(
    data.temperature
  );
  document.getElementById(
    "city-name"
  ).textContent = `${data.city}, ${data.country_code}`;
  document.getElementById("description").textContent = data.description;
  document.getElementById("feels-like").textContent = `${Math.round(
    data.feels_like
  )}°C`;
  document.getElementById("wind-speed").textContent = `${data.wind_speed} m/s`;
  document.getElementById("humidity").textContent = `${data.humidity}%`;
  document.getElementById("rain").textContent = `${data.rain_3h} mm`;
  document.getElementById(
    "coordinates"
  ).textContent = `${data.coordinates.lat.toFixed(
    2
  )}, ${data.coordinates.lon.toFixed(2)}`;
  document.getElementById("country-code").textContent = data.country_code;

  // Weather icon
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  document.getElementById("weather-icon").src = iconUrl;
  document.getElementById("weather-icon").alt = data.description;

  weatherSection.classList.remove("hidden");
}

/**
 * Display country data
 */
function displayCountry(data) {
  document.getElementById("country-name").textContent = data.name;
  document.getElementById("country-official").textContent = data.official_name;
  document.getElementById("country-capital").textContent = data.capital;
  document.getElementById("country-region").textContent = `${data.region} / ${
    data.subregion || "N/A"
  }`;
  document.getElementById("country-population").textContent = formatNumber(
    data.population
  );
  document.getElementById("country-area").textContent = `${formatNumber(
    data.area
  )} km²`;
  document.getElementById("country-languages").textContent =
    data.languages.join(", ") || "N/A";

  // Currency
  if (data.currencies && data.currencies.length > 0) {
    const currency = data.currencies[0];
    document.getElementById("country-currency").textContent = `${
      currency.name
    } (${currency.symbol || ""})`;
  } else {
    document.getElementById("country-currency").textContent = "N/A";
  }

  // Flag
  document.getElementById("country-flag").src = data.flag;
  document.getElementById("country-flag").alt =
    data.flag_alt || `${data.name} flag`;

  // Google Maps link
  const mapLinkDiv = document.getElementById("country-map-link");
  if (data.maps) {
    mapLinkDiv.querySelector("a").href = data.maps;
    mapLinkDiv.classList.remove("hidden");
  } else {
    mapLinkDiv.classList.add("hidden");
  }

  countrySection.classList.remove("hidden");
}

/**
 * Display news articles
 */
function displayNews(data) {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = "";

  if (!data.articles || data.articles.length === 0) {
    newsContainer.innerHTML =
      '<p class="no-news">No news articles found for this location.</p>';
    newsSection.classList.remove("hidden");
    return;
  }

  data.articles.forEach((article) => {
    const card = createNewsCard(article);
    newsContainer.appendChild(card);
  });

  newsSection.classList.remove("hidden");
}

/**
 * Create a news card element
 */
function createNewsCard(article) {
  const card = document.createElement("div");
  card.className = "news-card";

  // Format date
  const date = article.published_at ? new Date(article.published_at) : null;
  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  card.innerHTML = `
    ${
      article.image
        ? `<img src="${article.image}" alt="${article.title}" class="news-image" onerror="this.style.display='none'">`
        : ""
    }
    <div class="news-card-content">
      <h3><a href="${article.url}" target="_blank" rel="noopener noreferrer">${
    article.title || "No title"
  }</a></h3>
      <p>${article.description || "No description available."}</p>
      <div class="news-meta">
        <span class="news-source">${article.source || "Unknown source"}</span>
        <span class="news-date">${formattedDate}</span>
      </div>
    </div>
  `;

  return card;
}

// ===========================================
// Helper Functions
// ===========================================

function formatNumber(num) {
  if (!num) return "N/A";
  return num.toLocaleString("en-US");
}

function showLoading() {
  loadingDiv.classList.remove("hidden");
}

function hideLoading() {
  loadingDiv.classList.add("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  errorDiv.classList.add("hidden");
}

function hideAllSections() {
  weatherSection.classList.add("hidden");
  countrySection.classList.add("hidden");
  newsSection.classList.add("hidden");
}
