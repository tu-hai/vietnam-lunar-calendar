import { useState, useEffect } from "react";

// WMO Weather interpretation codes (ww) to Emojis
const getWeatherIcon = (code: number): string => {
  // Clear sky
  if (code === 0 || code === 1) return "☀️";
  // Cloudy
  if (code === 2 || code === 3 || code === 45 || code === 48) return "☁️";
  // Drizzle / Rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "❄️";
  // Thunderstorm
  if (code >= 95 && code <= 99) return "⛈️";

  return "🌡️";
};

export const useWeather = (coordinates: { latitude: number; longitude: number } | null) => {
  const [temperature, setTemperature] = useState<string>("--°C");
  const [weatherIcon, setWeatherIcon] = useState<string>("🌡️");

  useEffect(() => {
    if (!coordinates) return;

    const fetchWeather = async () => {
      try {
        const { latitude, longitude } = coordinates;
        // Using Open-Meteo API (Free, no key required)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        // console.log("Fetching weather from:", weatherUrl);
        const response = await fetch(weatherUrl);
        const data = await response.json();

        // console.log("Weather data received:", JSON.stringify(data, null, 2));

        if (data.current_weather) {
          const temp = Math.round(data.current_weather.temperature);
          const weatherCode = data.current_weather.weathercode;

          setTemperature(`${temp}°C`);
          setWeatherIcon(getWeatherIcon(weatherCode));
        } else {
          setTemperature("--°C");
          setWeatherIcon("🌡️");
        }
      } catch (error) {
        console.log("Error fetching weather:", error);
        setTemperature("--°C");
        setWeatherIcon("🌡️");
      }
    };

    fetchWeather();
  }, [coordinates]);

  return { temperature, weatherIcon };
};
