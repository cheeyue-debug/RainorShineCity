export interface WeatherAlert {
  title: string;
  message: string;
  severity: "warning" | "danger" | "none";
}

export interface WeatherForecastDay {
  day: string;
  condition: string; // Material symbols identifier e.g., 'rainy', 'sunny'
  temp: number; // In Celsius
}

export interface AttractionItem {
  name: string;
  status: "OPEN" | "CLOSED";
  volume: "High Vol" | "Mod Vol" | "Low Vol" | "Maintenance" | "None" | string;
  statusRationale: string;
  category: "skyline" | "garden" | "temple" | "museum" | "zoo" | "park" | "monument" | "beach" | "landmark" | string;
  imageUrl?: string;
}

export interface CityWeatherData {
  cityName: string;
  country: string;
  localTime: string;
  temperature: number;
  condition: string;
  conditionIcon: string; // Material symbol name e.g., 'partly_cloudy_day'
  airQuality: string; // e.g. "Good", "Moderate"
  humidity: number; // e.g. 75
  windSpeed: number; // e.g. 10
  feelsLike: number; // e.g. 36
  visibility: number; // e.g. 9
  alert: WeatherAlert | null;
  forecast: WeatherForecastDay[];
  attractions: AttractionItem[];
}
