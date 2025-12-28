/**
 * Weather & News API Server
 *
 * APIs Used:
 * 1. OpenWeather API (Core) - Real-time weather data
 * 2. Mediastack API (Additional #1) - News articles
 * 3. REST Countries API (Additional #2) - Country information
 */

// Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================================
// MIDDLEWARE
// ===========================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===========================================
// API ROUTES
// ===========================================

/**
 * CORE API: OpenWeather
 * GET /api/weather?city=CityName
 *
 * Returns: temperature, description, coordinates, feels_like,
 *          wind_speed, country_code, rain_3h (as required by assignment)
 */
app.get("/api/weather", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: "City parameter is required",
        example: "/api/weather?city=Astana",
      });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Server error: OpenWeather API key not configured",
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    // Return processed data (all fields required by assignment)
    const weatherData = {
      city: data.name,
      country_code: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      wind_speed: data.wind.speed,
      humidity: data.main.humidity,
      rain_3h: data.rain ? data.rain["3h"] || 0 : 0,
    };

    res.json(weatherData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    if (error.response?.status === 401) {
      return res.status(500).json({ error: "Invalid API key" });
    }
    console.error("Weather API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

/**
 * ADDITIONAL API #1: Mediastack (News)
 * GET /api/news?country=us&keywords=weather
 *
 * Returns: news articles related to the query
 */
app.get("/api/news", async (req, res) => {
  try {
    const { country, keywords } = req.query;

    const API_KEY = process.env.MEDIASTACK_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Server error: Mediastack API key not configured",
      });
    }

    // Build URL with optional parameters
    let url = `http://api.mediastack.com/v1/news?access_key=${API_KEY}&limit=5`;

    if (country) {
      url += `&countries=${encodeURIComponent(country.toLowerCase())}`;
    }
    if (keywords) {
      url += `&keywords=${encodeURIComponent(keywords)}`;
    }

    const response = await axios.get(url);
    const data = response.data;

    // Process and return news data
    const newsData = {
      total: data.pagination?.total || 0,
      articles: (data.data || []).map((article) => ({
        title: article.title,
        description: article.description,
        source: article.source,
        url: article.url,
        image: article.image,
        published_at: article.published_at,
        country: article.country,
      })),
    };

    res.json(newsData);
  } catch (error) {
    console.error("Mediastack API Error:", error.message);
    if (error.response?.status === 401) {
      return res.status(500).json({ error: "Invalid Mediastack API key" });
    }
    res.status(500).json({ error: "Failed to fetch news data" });
  }
});

/**
 * ADDITIONAL API #2: REST Countries
 * GET /api/country?code=KZ
 *
 * Returns: country details (capital, population, currencies, languages, flag)
 * No API key required!
 */
app.get("/api/country", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Country code parameter is required",
        example: "/api/country?code=KZ",
      });
    }

    const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
      code
    )}`;
    const response = await axios.get(url);
    const data = response.data[0];

    // Process and return country data
    const countryData = {
      name: data.name.common,
      official_name: data.name.official,
      capital: data.capital ? data.capital[0] : "N/A",
      region: data.region,
      subregion: data.subregion,
      population: data.population,
      area: data.area,
      languages: data.languages ? Object.values(data.languages) : [],
      currencies: data.currencies
        ? Object.values(data.currencies).map((c) => ({
            name: c.name,
            symbol: c.symbol,
          }))
        : [],
      flag: data.flags.svg,
      flag_alt: data.flags.alt,
      coat_of_arms: data.coatOfArms?.svg || null,
      maps: data.maps?.googleMaps || null,
      timezones: data.timezones,
      borders: data.borders || [],
    };

    res.json(countryData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Country not found" });
    }
    console.error("REST Countries API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// ===========================================
// SERVE FRONTEND
// ===========================================

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===========================================
// START SERVER
// ===========================================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);
  console.log("API Endpoints:");
  console.log("  [CORE]    GET /api/weather?city=Astana");
  console.log("  [ADD #1]  GET /api/news?country=kz&keywords=weather");
  console.log("  [ADD #2]  GET /api/country?code=KZ");
  console.log("");
});
