import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Hardcoded Singapore Data (matching the mockup exactly)
const singaporeData = {
  cityName: "Singapore",
  country: "Singapore",
  localTime: "Wednesday, October 25 • 14:30 SGT",
  temperature: 32,
  condition: "Partly Cloudy",
  conditionIcon: "partly_cloudy_day",
  airQuality: "Good",
  humidity: 75,
  windSpeed: 10,
  feelsLike: 36,
  visibility: 9,
  alert: {
    title: "Heavy Rain Warning",
    message: "Heavy Rain Warning in Jurong & Tuas areas until 16:00. Please exercise caution when traveling in these areas.",
    severity: "warning"
  },
  forecast: [
    { day: "Thu", condition: "rainy", temp: 31 },
    { day: "Fri", condition: "partly_cloudy_day", temp: 33 },
    { day: "Sat", condition: "sunny", temp: 34 },
    { day: "Sun", condition: "partly_cloudy_day", temp: 33 },
    { day: "Mon", condition: "thunderstorm", temp: 30 }
  ],
  attractions: [
    {
      name: "Gardens by the Bay",
      status: "OPEN",
      volume: "High Vol",
      statusRationale: "High density of visitors around the Flower Dome",
      category: "garden",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB83fXj1caSJmBQBnanHrOhWudwkIggpL0or5Pc7LUXmrcrcLIvm_wwLX1cHLKwV3ca_BxZ4kll9OMDqzqjq-sJZisfxtMLnuMoCzVIObelGVQZ-V9G7-VPl45vyVg1oc2h6L4ziVCMKJOll-HI3yC_LsEjdMTPL_7Ilo_y2KTyh_gc9FoH1soVPge89EFdGKhRCeE78PWwuEhCGxR1iDoDZGBCEpIyPuREWe556N7UGI2PhXOaDPrfXg"
    },
    {
      name: "Marina Bay Sands Skypark",
      status: "OPEN",
      volume: "Mod Vol",
      statusRationale: "Moderate queuing times for the observation deck",
      category: "skyline",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHm69pARA358EJ6Pj4sO7p-7XvD0gT0uUOwmeNQNYsg-5Y0bkWIW4sDXmk1hc0rC_yBxDGt9vSKJ03EaqexgqxlKSgu5UiQk7Q-efD8QYLGZTI5cdjOefWNRKvkmRHPueMx0FLEmcPsFba5tG2XowIhiGrb_CMR-FZrMriBx25sO_vygIAo1okVI_kvocn4DJxOoiFLWlBDxCaSC0jrrQ3IEDRQXImvsMO-sZVqohweLCmTEkd60HRdA"
    },
    {
      name: "Sentosa Merlion",
      status: "CLOSED",
      volume: "Maintenance",
      statusRationale: "Annual maintenance work on structure",
      category: "monument",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmW3N-k0u3DjHGjs_J3afzCAcUJMl7MmWKRKS4lC4FlKNjt5RyM8N4JVUzdDsoeBsyyBPH2hiic_jtgR1cUPHZVALopKbsYuHSBTYTYpVlxpPL1m5SXDe4KIRjGoqHY_-AR2MN3Cj0hlb13Or6SkMDnjfUmIJFUd2raXemeFuGOHV-I3GFG5AquBfy2krbN1jutZWdFcWixgTO4irOlxOzseRmwi8yw86fjlrz4Txexen8RiyFuFVB4w"
    },
    {
      name: "Singapore Zoo",
      status: "OPEN",
      volume: "Low Vol",
      statusRationale: "Clear pathways and low animal feeding queue times",
      category: "zoo",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwD9sgs6IZdmyaWUqdJGhFkbwzSS2pPDFm-ATwYOndLr_5kNyvpssApBwwvAKzk4IwvP72j7ctLCfy0wuhuddqg_-0IOXsbkuxOIFYXMlRpFCe7F5LwWG3i5kv4Tm2UW1-pk5RdpQcfdOgGOIzqwXpSEBT0Ho-grYGZNbUKhiiCAL5MoF33FtQyXLJP1WEtbW_98lrL22NjlmrUC_8mlhUCYM2__uM-OY71-TAIXKQQB5IAIEJ2QUXRA"
    }
  ]
};

// Fallback high-quality city templates when Gemini is offline or not configured
const mockFallbackCities: { [key: string]: any } = {
  singapore: singaporeData,
  tokyo: {
    cityName: "Tokyo",
    country: "Japan",
    localTime: "Thursday, October 26 • 15:30 JST",
    temperature: 21,
    condition: "Sunny",
    conditionIcon: "sunny",
    airQuality: "Good",
    humidity: 45,
    windSpeed: 12,
    feelsLike: 21,
    visibility: 10,
    alert: null,
    forecast: [
      { day: "Thu", condition: "sunny", temp: 21 },
      { day: "Fri", condition: "sunny", temp: 22 },
      { day: "Sat", condition: "cloudy", temp: 19 },
      { day: "Sun", condition: "partly_cloudy_day", temp: 20 },
      { day: "Mon", condition: "rainy", temp: 17 }
    ],
    attractions: [
      {
        name: "Senso-ji Temple",
        status: "OPEN",
        volume: "High Vol",
        statusRationale: "Popular morning prayers and marketplace activity",
        category: "temple"
      },
      {
        name: "Shinjuku Gyoen National Garden",
        status: "OPEN",
        volume: "Low Vol",
        statusRationale: "Serene walking paths and open lawn spaces",
        category: "garden"
      },
      {
        name: "Tokyo Skytree",
        status: "OPEN",
        volume: "Mod Vol",
        statusRationale: "Standard queue times for the upper galleries",
        category: "skyline"
      },
      {
        name: "Ueno Zoo",
        status: "OPEN",
        volume: "Mod Vol",
        statusRationale: "Moderate visitor levels in the giant panda exhibit",
        category: "zoo"
      }
    ]
  },
  london: {
    cityName: "London",
    country: "United Kingdom",
    localTime: "Thursday, October 26 • 07:30 BST",
    temperature: 12,
    condition: "Light Rain",
    conditionIcon: "rainy",
    airQuality: "Good",
    humidity: 85,
    windSpeed: 18,
    feelsLike: 10,
    visibility: 8,
    alert: {
      title: "Wind Advisory",
      message: "Strong gusty winds expected across Greater London until 12:00 BST. Secure loose outdoor objects.",
      severity: "warning"
    },
    forecast: [
      { day: "Thu", condition: "rainy", temp: 12 },
      { day: "Fri", condition: "cloudy", temp: 14 },
      { day: "Sat", condition: "partly_cloudy_day", temp: 15 },
      { day: "Sun", condition: "sunny", temp: 16 },
      { day: "Mon", condition: "rainy", temp: 11 }
    ],
    attractions: [
      {
        name: "The British Museum",
        status: "OPEN",
        volume: "High Vol",
        statusRationale: "High indoor attendance due to morning rain",
        category: "museum"
      },
      {
        name: "Tower of London",
        status: "OPEN",
        volume: "Mod Vol",
        statusRationale: "Steady queues near the Crown Jewels exhibit",
        category: "monument"
      },
      {
        name: "London Eye",
        status: "CLOSED",
        volume: "Maintenance",
        statusRationale: "Temporary high wind suspension",
        category: "skyline"
      },
      {
        name: "Hyde Park",
        status: "OPEN",
        volume: "Low Vol",
        statusRationale: "Few morning joggers and open walking lanes",
        category: "park"
      }
    ]
  },
  "new york": {
    cityName: "New York",
    country: "United States",
    localTime: "Thursday, October 26 • 02:30 EDT",
    temperature: 15,
    condition: "Cloudy",
    conditionIcon: "cloudy",
    airQuality: "Moderate",
    humidity: 60,
    windSpeed: 8,
    feelsLike: 14,
    visibility: 10,
    alert: null,
    forecast: [
      { day: "Thu", condition: "cloudy", temp: 15 },
      { day: "Fri", condition: "partly_cloudy_day", temp: 18 },
      { day: "Sat", condition: "sunny", temp: 20 },
      { day: "Sun", condition: "sunny", temp: 22 },
      { day: "Mon", condition: "rainy", temp: 14 }
    ],
    attractions: [
      {
        name: "Central Park",
        status: "OPEN",
        volume: "Low Vol",
        statusRationale: "Quiet early hours across the main loop",
        category: "park"
      },
      {
        name: "Metropolitan Museum of Art",
        status: "OPEN",
        volume: "High Vol",
        statusRationale: "High attendance for special exhibits",
        category: "museum"
      },
      {
        name: "Statue of Liberty",
        status: "OPEN",
        volume: "Mod Vol",
        statusRationale: "Regular ferry schedules and boarding volumes",
        category: "monument"
      },
      {
        name: "Empire State Building",
        status: "OPEN",
        volume: "Mod Vol",
        statusRationale: "Clear night viewing with standard waiting times",
        category: "skyline"
      }
    ]
  }
};

// Generic random weather generator for cities not in the list if offline
function generateRandomWeather(city: string) {
  const normalized = city.trim();
  const titleCased = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm"];
  const icons = ["sunny", "partly_cloudy_day", "cloudy", "rainy", "thunderstorm"];
  const index = Math.abs(normalized.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % conditions.length;
  
  const temp = 15 + (index * 4);
  const humidity = 40 + (index * 10);
  const wind = 5 + (index * 3);
  
  return {
    cityName: titleCased,
    country: "Destination",
    localTime: "Thursday, October 26 • 12:00 Local Time",
    temperature: temp,
    condition: conditions[index],
    conditionIcon: icons[index],
    airQuality: index % 2 === 0 ? "Good" : "Moderate",
    humidity: humidity,
    windSpeed: wind,
    feelsLike: temp + (humidity > 70 ? 2 : -1),
    visibility: 10 - Math.floor(index / 2),
    alert: index === 4 ? {
      title: "Adverse Weather Warning",
      message: `Active weather advisory in effect for ${titleCased} and surrounding areas.`,
      severity: "warning"
    } : null,
    forecast: [
      { day: "Thu", condition: icons[index], temp: temp },
      { day: "Fri", condition: icons[(index + 1) % conditions.length], temp: temp + 1 },
      { day: "Sat", condition: icons[(index + 2) % conditions.length], temp: temp - 1 },
      { day: "Sun", condition: "sunny", temp: temp + 3 },
      { day: "Mon", condition: "cloudy", temp: temp }
    ],
    attractions: [
      {
        name: `${titleCased} Historic Center`,
        status: "OPEN",
        volume: "Mod Vol",
        statusRationale: "Comfortable crowd levels for walking tours",
        category: "monument"
      },
      {
        name: `${titleCased} City Park & Gardens`,
        status: "OPEN",
        volume: "Low Vol",
        statusRationale: "Tranquil open lawns and floral walkways",
        category: "garden"
      },
      {
        name: `${titleCased} Modern Art Museum`,
        status: "OPEN",
        volume: "High Vol",
        statusRationale: "High visitor volume near the main gallery",
        category: "museum"
      },
      {
        name: `${titleCased} Panorama Tower`,
        status: "OPEN",
        volume: "Mod Vol",
        statusRationale: "Standard deck queues with high visibility",
        category: "skyline"
      }
    ]
  };
}

// Lazy Gemini client initialization helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
  }
  return aiClient;
}

// API Routes
app.post("/api/weather", async (req, res) => {
  const { city } = req.body;
  if (!city || typeof city !== "string") {
    return res.status(400).json({ error: "City name is required" });
  }

  const normalizedCity = city.trim().toLowerCase();

  // If the search is for Singapore, always prioritize the exact mockup data
  if (normalizedCity === "singapore") {
    return res.json(singaporeData);
  }

  const ai = getGeminiClient();
  if (!ai) {
    console.log("GEMINI_API_KEY is not configured or mock key used. Serving template response.");
    if (mockFallbackCities[normalizedCity]) {
      return res.json(mockFallbackCities[normalizedCity]);
    }
    return res.json(generateRandomWeather(city));
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Generate actual real-time styled weather and tourist attraction data for the city of "${city}". Make sure the attractions are real and famous locations in that city. Keep descriptions and local times accurate.`,
      config: {
        systemInstruction: "You are an expert global travel guide and weather advisor. Return detailed weather, local time, any realistic warnings (if applicable or empty if none), and the top 4 attractions with tourist crowding categories. Output format MUST be strict valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cityName: { type: Type.STRING },
            country: { type: Type.STRING },
            localTime: { type: Type.STRING, description: "Current day, month name, date, and local time with timezone code, e.g. 'Thursday, October 26 • 15:30 JST'" },
            temperature: { type: Type.INTEGER, description: "Current temperature in Celsius" },
            condition: { type: Type.STRING, description: "Current weather condition (e.g. 'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Snowy')" },
            conditionIcon: { type: Type.STRING, description: "Material symbol name matching condition closely. ONLY choose one of: 'sunny', 'partly_cloudy_day', 'cloudy', 'rainy', 'thunderstorm', 'snowing', 'mist'" },
            airQuality: { type: Type.STRING, description: "Air quality status: 'Good', 'Moderate', 'Unhealthy'" },
            humidity: { type: Type.INTEGER },
            windSpeed: { type: Type.INTEGER, description: "Wind speed in km/h" },
            feelsLike: { type: Type.INTEGER, description: "Feels like temperature in Celsius" },
            visibility: { type: Type.INTEGER, description: "Visibility in km" },
            alert: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Active warning title or empty string if none" },
                message: { type: Type.STRING, description: "Active warning details or empty string if none" },
                severity: { type: Type.STRING, description: "warning, danger, or none" }
              },
              required: ["title", "message", "severity"]
            },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "3-letter day name, e.g. Thu, Fri" },
                  condition: { type: Type.STRING, description: "Material symbol name: 'sunny', 'partly_cloudy_day', 'cloudy', 'rainy', 'thunderstorm'" },
                  temp: { type: Type.INTEGER }
                },
                required: ["day", "condition", "temp"]
              }
            },
            attractions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the landmark or attraction" },
                  status: { type: Type.STRING, description: "OPEN or CLOSED" },
                  volume: { type: Type.STRING, description: "High Vol, Mod Vol, Low Vol, or Maintenance" },
                  statusRationale: { type: Type.STRING, description: "A brief 1-sentence crowding rationale or reason for closure" },
                  category: { type: Type.STRING, description: "One of: skyline, garden, temple, museum, zoo, park, monument, beach, landmark" }
                },
                required: ["name", "status", "volume", "statusRationale", "category"]
              }
            }
          },
          required: [
            "cityName", "country", "localTime", "temperature", "condition", 
            "conditionIcon", "airQuality", "humidity", "windSpeed", "feelsLike", 
            "visibility", "alert", "forecast", "attractions"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Gracefully fallback to high-quality mockup templates or random generator
    if (mockFallbackCities[normalizedCity]) {
      return res.json(mockFallbackCities[normalizedCity]);
    }
    return res.json(generateRandomWeather(city));
  }
});

// Start Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
