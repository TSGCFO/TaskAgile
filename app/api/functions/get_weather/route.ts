import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const unit = searchParams.get("unit") || "celsius";

    if (!location) {
      return Response.json({ error: "Location parameter is required" }, { status: 400 });
    }

    // Get coordinates from OpenStreetMap
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    );
    const geoData = await geoRes.json();
    
    if (!geoData.length) {
      return Response.json({ error: "Location not found" }, { status: 404 });
    }

    const { lat, lon } = geoData[0];

    // Get weather from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${unit}`
    );
    const weather = await weatherRes.json();

    return Response.json({
      location: geoData[0].display_name,
      temperature: weather.current_weather.temperature,
      unit: unit,
      description: getWeatherDescription(weather.current_weather.weathercode),
      windSpeed: weather.current_weather.windspeed,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return Response.json({ error: "Failed to get weather data" }, { status: 500 });
  }
}

function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy", 
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm",
  };
  return descriptions[code] || "Unknown weather condition";
}
