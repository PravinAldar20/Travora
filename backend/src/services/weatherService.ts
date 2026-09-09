import axios from 'axios';

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
  rainProbability: number;
  dailyForecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProbability: number;
    weatherCode: number;
  }>;
  hourlyForecast: Array<{
    time: string;
    temp: number;
    rainProbability: number;
  }>;
  alerts?: string[];
  source: 'Open-Meteo (Real Live Satellite/Radar)' | 'OpenWeatherMap';
}

// Convert WMO Weather Interpretation Codes to human descriptions
function parseWMOCode(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 66 && code <= 67) return 'Freezing Rain';
  if (code >= 71 && code <= 77) return 'Snow fall';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Cloudy';
}

export async function fetchRealWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    // Open-Meteo provides real, non-commercial and commercial high-accuracy global weather without an API key requirement
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data;

    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const dailyForecast = (daily.time || []).slice(0, 7).map((dateStr: string, idx: number) => ({
      date: dateStr,
      tempMax: Math.round(daily.temperature_2m_max[idx]),
      tempMin: Math.round(daily.temperature_2m_min[idx]),
      condition: parseWMOCode(daily.weather_code[idx]),
      rainProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 10,
      weatherCode: daily.weather_code[idx],
    }));

    const hourlyForecast = (hourly.time || []).slice(0, 24).map((timeStr: string, idx: number) => ({
      time: timeStr.split('T')[1] || timeStr,
      temp: Math.round(hourly.temperature_2m[idx]),
      rainProbability: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0,
    }));

    const currentRainProb = dailyForecast[0]?.rainProbability ?? 0;
    const alerts: string[] = [];
    if (currentRainProb >= 60 || (current.weather_code >= 61 && current.weather_code <= 99)) {
      alerts.push('High chance of rain detected. Itinerary indoor-swap recommended.');
    }
    if (current.temperature_2m > 36) {
      alerts.push('Extreme heat alert. Stay hydrated and avoid midday outdoor exposure.');
    }

    return {
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCode: current.weather_code,
      condition: parseWMOCode(current.weather_code),
      isDay: Boolean(current.is_day),
      rainProbability: currentRainProb,
      dailyForecast,
      hourlyForecast,
      alerts,
      source: 'Open-Meteo (Real Live Satellite/Radar)',
    };
  } catch (error: any) {
    console.error('Failed to fetch real weather from Open-Meteo:', error.message);
    throw new Error(`Weather data temporarily unavailable from provider: ${error.message}`);
  }
}
